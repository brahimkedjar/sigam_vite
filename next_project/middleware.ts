import { NextRequest, NextResponse } from 'next/server';

const apiURL = process.env.NEXT_PUBLIC_API_URL;

const protectedRoutes = [
  '/dashboard',
  '/admin_panel',
  '/demande',
  '/DEA',
  '/gestion-permis',
  '/controle-minier',
  '/instruction-cadastrale',
  '/permis_dashboard'
];

const routePermissionMap: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/admin_panel': 'Admin-Panel',
  '/DEA': 'Payments',
  '/gestion-permis': 'manage_permits',
  '/controle-minier': 'controle_minier',
  '/instruction-cadastrale': 'view_cadastre',
  '/permis_dashboard': 'dashboard'
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get token from cookies
  const sessionToken = req.cookies.get('auth_token')?.value;

  // Handle root path redirection
  if (pathname === '/') {
    if (sessionToken) {
      try {
        const verifyResponse = await fetch(`${apiURL}/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: sessionToken }),
        });
        
        if (verifyResponse.ok) {
          return NextResponse.redirect(new URL('/permis_dashboard/PermisDashboard', req.url));
        }
      } catch (err) {
        console.error('Session verification failed:', err);
      }
    }
    return NextResponse.next();
  }
  // Check for protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/unauthorized/page?reason=not_authenticated', req.url));
    }

    try {
      // Verify session with the backend
      const res = await fetch(`${apiURL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: sessionToken }),
        cache: 'no-store',
      });
  console.log("wwwwwwwwwwwwww",res)

      if (!res.ok) throw new Error('Unauthorized');

      const { user } = await res.json();

      // Admin panel access check
      if (pathname.startsWith('/admin_panel') && user.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized/page?reason=insufficient_role', req.url));
      }

      // Permission check
      for (const [route, requiredPermission] of Object.entries(routePermissionMap)) {
        if (pathname.startsWith(route) && !user.permissions.includes(requiredPermission)) {
          return NextResponse.redirect(new URL('/unauthorized/page?reason=missing_permissions', req.url));
        }
      }

    } catch (err) {
      console.error('❌ Middleware auth error:', err);
      // Clear invalid session
      const response = NextResponse.redirect(new URL('/unauthorized/page?reason=auth_error', req.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/admin_panel/:path*',
    '/demande/:path*',
    '/DEA/:path*',
    '/gestion-permis/:path*',
    '/controle-minier/:path*',
    '/instruction-cadastrale/:path*',
    '/permis_dashboard/:path*',
  ],
};