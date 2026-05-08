import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req as any;
  const isLoggedIn = !!session;
  const isLoginPage = nextUrl.pathname === "/login";
  const isApiAuth = nextUrl.pathname.startsWith("/api/auth");

  // API auth 라우트는 항상 통과
  if (isApiAuth) return NextResponse.next();

  // 로그인 안 됐으면 /login으로
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // 이미 로그인됐는데 /login 접근하면 홈으로
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
