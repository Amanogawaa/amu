import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    '/signin',
    '/signup',
    '/about',
    '/features',
    '/privacy',
    '/terms',
    '/glossary',
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (pathname === '/') {
    return NextResponse.next();
  }

  // Remove the redirect for signin/signup when user has token
  // Let the client-side handle this instead
  // if (
  //   (pathname.startsWith('/signin') || pathname.startsWith('/signup')) &&
  //   token
  // ) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  if (!isPublicRoute && !token) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.webp$|.*\\.ico$).*)',
  ],
};
