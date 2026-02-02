import fs from "fs";
import path from "path";

const AYUDA_PATH = path.resolve(process.cwd(), "../laborario/docs/AYUDA.md");

function loadFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

let _cachedKnowledge: string | null | undefined;

export function getLaborarioKnowledge(): string | null {
  if (_cachedKnowledge !== undefined) return _cachedKnowledge;

  const ayuda = loadFile(AYUDA_PATH);
  if (!ayuda) {
    _cachedKnowledge = null;
    return null;
  }

  _cachedKnowledge = `--- Laborario User Help Documentation ---\n${ayuda}\n--- End User Help Documentation ---`;
  return _cachedKnowledge;
}
