import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin Panel"' },
  });
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (!isAdminRoute) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  const base64 = auth.slice("Basic ".length);
  const decoded = atob(base64); // "user:pass"
  const [user, pass] = decoded.split(":");

  const ADMIN_USER = (process.env.ADMIN_USER ?? "").trim();
  const ADMIN_PASS = (process.env.ADMIN_PASS ?? "").trim();

  if (!ADMIN_USER || !ADMIN_PASS) return unauthorized();
  if ((user ?? "").trim() !== ADMIN_USER) return unauthorized();
  if ((pass ?? "").trim() !== ADMIN_PASS) return unauthorized();

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
