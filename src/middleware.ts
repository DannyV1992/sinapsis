import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dejar pasar la página de login y los endpoints de auth
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  // Proteger todo /admin y /api/admin
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const session = request.cookies.get("admin_session")?.value;
    if (!session || session !== process.env.ADMIN_PASSWORD) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
