import { NextRequest, NextResponse } from "next/server";
import { SECURITY_CONFIG } from "./config/security";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // اعمال هدرهای امنیتی
  Object.entries(SECURITY_CONFIG.securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // بررسی HTTPS در محیط تولید
  if (
    SECURITY_CONFIG.httpsOnly &&
    request.headers.get("x-forwarded-proto") !== "https"
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get("host")}${request.nextUrl.pathname}`
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
