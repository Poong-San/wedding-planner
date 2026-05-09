import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 항상 통과
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  const isLoginPage = pathname === "/login";

  // next-auth 세션 쿠키 확인 (쿠키 이름 통일)
  const sessionToken = request.cookies.get("next-auth.session-token")?.value;

  const isLoggedIn = !!sessionToken;

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
