import fs from "fs";
import path from "path";

const AYUDA_PATH = path.resolve(process.cwd(), "../laborario/docs/AYUDA.md");

const GITHUB_API_URL =
  "https://api.github.com/repos/koilabcode/laborario/contents/docs/AYUDA.md";

function loadFromFilesystem(): string | null {
  try {
    return fs.readFileSync(AYUDA_PATH, "utf-8");
  } catch {
    return null;
  }
}

async function loadFromGitHub(): Promise<string | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("[laborarioKnowledge] No GITHUB_TOKEN set, cannot fetch from GitHub");
    return null;
  }

  try {
    const res = await fetch(GITHUB_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3.raw",
      },
    });

    if (!res.ok) {
      console.warn(`[laborarioKnowledge] GitHub API returned ${res.status}`);
      return null;
    }

    return await res.text();
  } catch (err) {
    console.warn("[laborarioKnowledge] Failed to fetch from GitHub:", err);
    return null;
  }
}

let _cachedKnowledge: string | null | undefined;
let _fetchPromise: Promise<string | null> | null = null;

export async function getLaborarioKnowledge(): Promise<string | null> {
  if (_cachedKnowledge !== undefined) return _cachedKnowledge;

  // Try local filesystem first (dev), then GitHub API (production)
  const local = loadFromFilesystem();
  if (local) {
    _cachedKnowledge = `--- Laborario User Help Documentation ---\n${local}\n--- End User Help Documentation ---`;
    return _cachedKnowledge;
  }

  // Deduplicate concurrent fetches
  if (!_fetchPromise) {
    _fetchPromise = loadFromGitHub();
  }

  const remote = await _fetchPromise;
  _fetchPromise = null;

  if (remote) {
    _cachedKnowledge = `--- Laborario User Help Documentation ---\n${remote}\n--- End User Help Documentation ---`;
  } else {
    _cachedKnowledge = null;
  }

  return _cachedKnowledge;
}
