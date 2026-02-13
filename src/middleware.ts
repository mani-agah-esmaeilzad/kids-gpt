import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isParent = pathname.startsWith("/parent");
  const isAdmin = pathname.startsWith("/admin");
  const isProfilesManage =
    pathname.startsWith("/profiles/manage") ||
    pathname.startsWith("/profiles/new") ||
    pathname.startsWith("/profiles/") && pathname.endsWith("/edit");
  const isKid = pathname.startsWith("/kid");

  if (isParent || isProfilesManage || isAdmin) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    if (isAdmin && token.role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = "/parent";
      return NextResponse.redirect(url);
    }
  }

  if (isKid) {
    const kidCookie = request.cookies.get("gptkids_kid")?.value;
    if (!kidCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/profiles";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/parent/:path*", "/admin/:path*", "/profiles/:path*", "/kid/:path*"]
};
