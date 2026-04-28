import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const valid = await verifyAdminSessionToken(token);
    if (valid) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const valid = await verifyAdminSessionToken(token);

  if (!valid) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
