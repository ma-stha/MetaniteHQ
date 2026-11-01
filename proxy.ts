import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { hasPublicEnv } from "@/lib/env";

const PUBLIC_PATHS = ["/login", "/forgot-password", "/auth/callback"];

export async function proxy(request: NextRequest) {
  if (!hasPublicEnv()) {
    return new NextResponse(
      "Metanite HQ is not configured yet. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel (Project Settings, Environment Variables) and redeploy.",
      { status: 503, headers: { "content-type": "text/plain" } },
    );
  }
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
    return NextResponse.redirect(url);
  }

  if (user && (pathname === "/login" || pathname === "/forgot-password")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Everything except static assets and images.
  matcher: ["/((?!_next/static|_next/image|icon.png|brand/|favicon.ico).*)"],
};
