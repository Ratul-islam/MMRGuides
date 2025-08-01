import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const jwt = request.cookies.get('jwt')?.value;

  if (!jwt) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  try {
    await jwtVerify(jwt, secret);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
