
import { NextRequest, NextResponse } from 'next/server';

// This function checks if the user is authenticated and has the necessary roles for a route
function CheckRouteAndRoles(roles: string[], path: string): { redirect: boolean; redirectUrl: string } {
  let auth = false; // Hardcoded for testing; replace with actual auth logic
  
  if (!auth) {
    console.log("auth middleware running unauthenticated");
    return { redirect: true, redirectUrl: '/login' };
  }

  console.log("auth middleware running authenticated");
  return { redirect: false, redirectUrl: '' };
}

export async function authAndRole(req: NextRequest) {
  console.log("auth middleware running auth");
  const auth = req.cookies.get('auth') || null; // Assuming auth info is stored in cookies

  if (auth) {
    const { roles } = JSON.parse(auth as unknown as string); // Parsing the auth cookie to get roles
    const { redirect, redirectUrl } = CheckRouteAndRoles(roles, req.nextUrl.pathname);

    if (redirect) {
      const newUrl = new URL(redirectUrl, req.nextUrl.origin);
      return NextResponse.redirect(newUrl);
    }
  } else {
    // If not authenticated, redirect to login
    if (req.nextUrl.pathname !== '/login') {
      const newUrl = new URL('/login', req.nextUrl.origin);
      return NextResponse.redirect(newUrl);
    }
  }

  // If no redirect was necessary, continue with the response
  return NextResponse.next();
}
