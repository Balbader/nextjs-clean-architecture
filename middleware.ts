/**
 * This middleware acts as an infrastructure layer component in the clean architecture pattern.
 * It handles cross-cutting concerns like authentication and session validation for the application.
 * The middleware intercepts all non-API HTTP requests to ensure users are authenticated before
 * accessing protected routes. It integrates with the authentication service through dependency
 * injection, maintaining separation of concerns and keeping the authentication logic independent
 * from the delivery mechanism.
 */

import { NextResponse, type NextRequest } from 'next/server';

import { getInjection } from '@/di/container';
import { SESSION_COOKIE } from '@/config';

export async function middleware(request: NextRequest) {
  const isAuthPath =
    request.nextUrl.pathname === '/sign-in' ||
    request.nextUrl.pathname === '/sign-up';

  if (!isAuthPath) {
    const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
    if (!sessionId) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    try {
      const authenticationService = getInjection('IAuthenticationService');
      await authenticationService.validateSession(sessionId);
    } catch (err) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
