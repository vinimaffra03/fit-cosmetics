import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin =
    (req.auth?.user as any)?.role === "ADMIN" ||
    (req.auth?.user as any)?.role === "SUPER_ADMIN";

  // Admin routes protection
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isLoggedIn || !isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Protected customer routes
  const protectedRoutes = ["/minha-conta", "/meus-pedidos", "/checkout"];
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${pathname}`, req.url)
      );
    }
  }

  // Redirect logged-in users away from login/register
  if (pathname === "/login" || pathname === "/registro") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/minha-conta/:path*",
    "/meus-pedidos/:path*",
    "/checkout/:path*",
    "/login",
    "/registro",
  ],
};
