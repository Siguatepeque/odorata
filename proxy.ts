import { NextResponse, type NextRequest } from "next/server";

// The device's language picks the store's language: English when the browser
// prefers English, Spanish (the store's main language) otherwise.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (/^\/(es|en)(\/|$)/.test(pathname)) return;
  const first = request.headers.get("accept-language")?.split(",")[0]?.trim().toLowerCase() ?? "";
  request.nextUrl.pathname = `/${first.startsWith("en") ? "en" : "es"}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, the lab, and any file with an extension (videos, posters, icons).
  matcher: ["/((?!_next|lab|.*\\.[\\w]+$).*)"],
};
