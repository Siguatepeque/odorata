import type { NextConfig } from "next";

// GITHUB_PAGES=1 builds a static copy for siguatepeque.github.io/odorata; otherwise it's the normal app.
const pages = process.env.GITHUB_PAGES === "1";
const basePath = pages ? "/odorata" : "";

const nextConfig: NextConfig = {
  // Partial prerendering needs a server, so the static copy goes without it.
  ...(pages
    ? { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } }
    : { cacheComponents: true, partialPrefetching: true }),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
