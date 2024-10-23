import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get("token")?.value || "";

  if (!token && ['/profile', '/dashboard'].some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/dashboard'],
};