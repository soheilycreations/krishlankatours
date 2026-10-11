import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // www.krishlankatours.com → krishlankatours.com (301). A Cloudflare
  // redirect rule does this too; this is the in-app safety net.
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.slice(4);
    url.port = "";
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  // /admin is a plain (non-localized) section protected by Supabase Auth.
  // This only checks "signed in"; every admin page and server action
  // additionally checks the admin allowlist (lib/auth.ts).
  if (pathname.startsWith("/admin")) {
    let response = NextResponse.next({ request });

    // Supabase isn't configured yet — send people to login, which will
    // show a friendly "not configured" message rather than crashing.
    if (!supabaseUrl || !supabaseAnonKey) {
      if (pathname !== "/admin/login") {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      return response;
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    // ?denied=1 = signed in but not on the admin allowlist; stay on the
    // login page so it can explain that (and offer "sign out").
    if (user && pathname === "/admin/login" && !request.nextUrl.searchParams.has("denied")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip API routes, Next internals, the /media image proxy and any file
  // with an extension (images, sitemap.xml, robots.txt, ...).
  matcher: ["/((?!api|media|_next|.*\\..*).*)"],
};
