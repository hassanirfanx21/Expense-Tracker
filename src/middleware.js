import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Helper to construct absolute URL using NEXT_PUBLIC_APP_URL if set (for Replit)
  const getRedirectUrl = (path) => {
     if (process.env.NEXT_PUBLIC_APP_URL) {
       return new URL(path, process.env.NEXT_PUBLIC_APP_URL);
     }
     const url = request.nextUrl.clone();
     url.pathname = path;
     return url;
  };

  // Protected routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(getRedirectUrl('/login'));
  }

  // Redirect logged-in users away from login
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(getRedirectUrl('/dashboard'));
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
