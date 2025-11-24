import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = ['/signin', '/signup']

// API routes that don't require authentication
const publicApiRoutes = ['/api/auth/signin', '/api/auth/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
  const isPublicApiRoute = publicApiRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

  // Check for auth token
  const token = request.cookies.get('auth-token')?.value

  // If authenticated and trying to access signin/signup, redirect to home
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Allow public routes and public API routes without token
  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next()
  }

  // If no token and trying to access protected route, redirect to signin
  if (!token) {
    // For API routes, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // For page routes, redirect to signin
    const signinUrl = new URL('/signin', request.url)
    if (pathname !== '/') {
      signinUrl.searchParams.set('callbackUrl', pathname)
    }
    return NextResponse.redirect(signinUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
