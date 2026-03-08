import { NextResponse } from "next/server";

function hasUserToken(request) {
  const token = request.cookies.get("user_token");
  return token && token.value;
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const userToken = hasUserToken(request);

  if (
    userToken &&
    (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  // Beskyt profil og mine listings mod uautoriserede brugere
  if (pathname.startsWith("/profile") || pathname.startsWith("/my-listings")) {
    if (!userToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/sign-in", "/sign-up", "/my-listings/:path*"],
};
