import { NextResponse } from 'next/server';
import axios from 'axios';

export async function middleware(request) {
  const token = request.cookies.get('tokentwo')?.value || '';

  const loginUrl = new URL('/auth/login', request.url);
  const dashboardUrl = new URL('/dashboard', request.url);

  try {
    const res = await axios.post('http://localhost:8000/auth/verifyToken', {}, {
      headers: {
        Cookie: `tokentwo=${token}`,
      }
    });

    if (res.status === 200 && res.data === 'User is authorized') {
      if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(dashboardUrl);
      }
      return NextResponse.next();
    } else {
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    console.error('Error verifying token:', error.response?.data || error.message);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/', '/dashboard/:path'],
};
