
import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from './ratelimiter';
import { authAndRole } from './authAndRole';

export async function middleware(req: NextRequest) {
  console.log("middleware chain started");

  // 1. Rate Limiting Check
  const rateLimitResponse = await rateLimiter(req);
  console.log("rateLimitChain response");

  // If rate limit is exceeded, return the rate limit response immediately
  if (rateLimitResponse.status === 429) return rateLimitResponse;

  console.log("middleware chain run1");

  // 2. Authentication and Role Check
  const authRoleResponse = await authAndRole(req);
  console.log("middleware chain run2");

  // If user is not authorized, return the auth response
  if (authRoleResponse.status !== 200) return authRoleResponse;

  // Proceed with the request if all checks passed
  return NextResponse.next();
}

// Exclude images and static content from middleware
export const config = {
  matcher: '/:path*', // Apply to all routes except static or image files
};
