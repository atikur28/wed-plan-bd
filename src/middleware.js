import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get("token")?.value || "";

  const protectedRoutes = ['/profile', '/dashboard', '/dashboard/admin/users', '/dashboard/admin/providers', '/dashboard/admin/events', '/dashboard/admin/reports', '/dashboard/admin/partners', '/dashboard/provider', '/dashboard/provider/add-post', '/dashboard/provider/manage-posts', '/dashboard/provider/bookings', '/dashboard/provider/availability', '/dashboard/provider/reviews', '/dashboard/user', '/dashboard/user/bookings', '/dashboard/user/providers', '/dashboard/user/reviews', '/dashboard/user/wishlist', '/dashboard/settings'];

  if (!token && protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/dashboard/:path*'],
};
