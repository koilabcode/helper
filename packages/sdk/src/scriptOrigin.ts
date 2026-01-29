if (typeof window === "undefined" || !window.document.currentScript) {
  throw new Error("Script origin not found. The SDK is intended to run in a browser environment.");
}

const scriptUrl = new URL((window.document.currentScript as HTMLScriptElement)?.src);

// Derive the basePath from the script URL. The SDK is served at <basePath>/widget/sdk.js,
// so stripping "/widget/sdk.js" from the pathname gives us the basePath (e.g. "/soporte").
const basePath = scriptUrl.pathname.replace(/\/widget\/sdk\.js$/, "");

export const scriptOrigin = scriptUrl.origin + basePath;

if (!scriptOrigin) {
  throw new Error("Script origin not found. The SDK is intended to run in a browser environment.");
}
