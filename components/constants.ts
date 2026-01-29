import { env } from "@/lib/env";

export const EMAIL_UNDO_COUNTDOWN_SECONDS = 60;

export const DEFAULT_CONVERSATIONS_PER_PAGE = 25;

export const BASE_PATH = "/soporte";

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin + BASE_PATH;
  return env.AUTH_URL;
};

/** Prepend the basePath to an API route for use with raw fetch() calls. */
export const apiPath = (path: string) => `${BASE_PATH}${path}`;

export const getMarketingSiteUrl = () => {
  if (getBaseUrl() === env.NEXT_PUBLIC_DEV_HOST) {
    return "http://localhost:3011";
  }
  return "https://helper.ai";
};
