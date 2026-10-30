import type { LocationRewrite } from "@tanstack/react-router";

/**
 * Path-based preview hosts serve the dev server under `/{port_id}/` and strip
 * that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
 * prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
 * client routing and generated links aligned with the public URL.
 */
const PATH_BASED_PREVIEW_HOSTS = new Set([
  "preview.grok.genai.mil",
  "preview.grok.mil",
  "preview.grokgsac.com",
]);

const PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;

export function previewPathPrefix(hostname: string, pathname: string): string | undefined {
  if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return undefined;
  return PORT_ID_PREFIX.exec(pathname)?.[0];
}

export function prefixRewrite(prefix: string): LocationRewrite {
  return {
    input: ({ url }) => {
      if (url.pathname === prefix) url.pathname = "/";
      else if (url.pathname.startsWith(`${prefix}/`))
        url.pathname = url.pathname.slice(prefix.length);
      return url;
    },
    output: ({ url }) => {
      url.pathname = `${prefix}${url.pathname}`;
      return url;
    },
  };
}

export function prefixAssetPath(path: string, hostname: string, pathname: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const prefix =
    previewPathPrefix(hostname, pathname) ?? PORT_ID_PREFIX.exec(pathname)?.[0];
  return prefix ? `${prefix}${clean}` : clean;
}

function publicBase(): string {
  const raw =
    typeof import.meta !== "undefined" && import.meta.env && typeof import.meta.env.BASE_URL === "string"
      ? import.meta.env.BASE_URL
      : "/";
  if (!raw || raw === "/") return "";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

/** Public files under a path-based preview (`/hds-…/dressup/…`), or the path as-is. */
export function previewAssetUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (typeof window === "undefined") return `${publicBase()}${clean}`;
  const prefixed = prefixAssetPath(clean, window.location.hostname, window.location.pathname);
  if (prefixed !== clean) return prefixed;
  return `${publicBase()}${clean}`;
}

export function previewPathRewrite(): LocationRewrite | undefined {
  if (typeof window === "undefined") return undefined;
  const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
  return prefix ? prefixRewrite(prefix) : undefined;
}
