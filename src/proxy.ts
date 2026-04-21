import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Minimal JWT decoder for middleware
function decodeRole(token: string): string | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    
    // Standard base64 decoding in Edge/Browser
    const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    const payload = JSON.parse(json);
    
    // Check for standard role claim or 'role' property
    const roleValue = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? payload.role;
    
    if (!roleValue) return null;
    
    // Normalize numeric roles if applicable (matches AuthContext logic)
    if (roleValue === "1" || roleValue.toLowerCase() === "admin") return "admin";
    if (roleValue === "2" || roleValue.toLowerCase() === "staff") return "staff";
    if (roleValue === "4" || roleValue.toLowerCase() === "craftsman") return "craftsman";
    if (roleValue === "5" || roleValue.toLowerCase() === "qc") return "qc";
    
    return roleValue.toLowerCase();
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = token ? decodeRole(token) : null;

  // 1. Define staff roles that should be locked out of customer pages
  const isWorkOnlyRole = role === "craftsman" || role === "qc";

  // 2. Paths that are NOT staff/admin dashboards and NOT public assets/auth/api
  const isCustomerPage = 
    !pathname.startsWith("/staff") && 
    !pathname.startsWith("/admin") && 
    !pathname.startsWith("/api") && 
    !pathname.startsWith("/auth") && 
    !pathname.startsWith("/_next") &&
    pathname !== "/favicon.ico" &&
    pathname !== "/robots.txt";

  // 3. Locking logic: Redirect Craftsman/QC back to their dashboard if they try to browse the shop
  if (isWorkOnlyRole && isCustomerPage) {
    const target = role === "craftsman" ? "/staff/manufacturing" : "/staff/qc";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 4. Protect /staff and /admin routes generally
  if (pathname.startsWith("/staff") && !role) {
     return NextResponse.redirect(new URL("/auth", request.url));
  }
  
  if (pathname.startsWith("/admin") && role !== "admin") {
      const target = role ? (isWorkOnlyRole ? (role === "craftsman" ? "/staff/manufacturing" : "/staff/qc") : "/") : "/auth";
      return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
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
