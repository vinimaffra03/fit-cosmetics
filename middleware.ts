import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdminLogin = pathname === "/admin/login";

  if (isAdminLogin) return NextResponse.next();

  const token = req.auth;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const role = (token.user as any)?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
