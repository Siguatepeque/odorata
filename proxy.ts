import { NextResponse, type NextRequest } from "next/server";

// The store opens in Spanish; English is linked in the footer.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (/^\/(es|en)(\/|$)/.test(pathname)) return;
  request.nextUrl.pathname = `/es${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, the lab, and any file with an extension (videos, posters, icons).
  matcher: ["/((?!_next|lab|.*\\.[\\w]+$).*)"],
};
