import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = request.cookies.get("token")?.value || "";

  const protectedRoutes = [
    '/profile', '/dashboard', '/dashboard/user', '/dashboard/user/bookings', '/dashboard/user/providers', '/dashboard/user/reviews', '/dashboard/user/wishlist', '/dashboard/settings'
  ];

  const adminRoutes = [
    '/dashboard/admin', '/dashboard/admin/users', '/dashboard/admin/providers', '/dashboard/admin/events', '/dashboard/admin/reports', '/dashboard/admin/partners'
  ];

  const providerRoutes = [
    '/dashboard/provider', '/dashboard/provider/add-post',
    '/dashboard/provider/manage-posts', '/dashboard/provider/bookings', '/dashboard/provider/availability', '/dashboard/provider/reviews'
  ];

  if (!token && protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.SECRET_TOKEN);

      const { payload } = await jwtVerify(token, secret);

      const email = payload.email;

      const userResponse = await fetch("http://localhost:3034/api/users/get-user", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const userData = await userResponse.json();

      const status = userData.status;

      if(status !== "Admin" && adminRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/signin', request.url));
      }

      if(status !== "Provider" && providerRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/signin', request.url));
      }

    } catch (error) {
      console.error("Token verification failed:", error.message);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/dashboard/:path*'],
};