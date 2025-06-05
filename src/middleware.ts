import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log('Middleware running for path:', pathname)

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/privacy', '/terms', '/support']
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
  
  // Protected routes that require authentication
  const protectedRoutes = ['/socials', '/report', '/premium']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // API ve statik dosyaları atla
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.includes('favicon')
  ) {
    return NextResponse.next()
  }

  // Session kontrolü
  const session = request.cookies.get('__session')?.value
  console.log('Session status:', session ? 'exists' : 'no session')

  // Public route - allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected route - check auth
  if (isProtectedRoute) {
    if (!session) {
      console.log('Protected route accessed without session, redirecting to login')
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Allow access to all other routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 