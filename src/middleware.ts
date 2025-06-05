import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('__session')
  
  // Korunacak rotalar
  const protectedPaths = ['/socials', '/report', '/premium']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // Public rotalar
  const publicPaths = ['/', '/login', '/u']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // Kullanıcı giriş yapmamış ve korumalı sayfaya erişmeye çalışıyorsa
  if (!authCookie && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Kullanıcı giriş yapmış ve login sayfasına gitmeye çalışıyorsa
  if (authCookie && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/socials', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 