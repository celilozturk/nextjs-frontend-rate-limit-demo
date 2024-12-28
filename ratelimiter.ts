
// import { NextRequest, NextResponse } from 'next/server';

// interface RateLimitData {
//   lastRequestTime: number;
//   requestCount: number;
// }

// const RATE_LIMIT = 30; // Number of requests allowed within 1 minute
// const TIME_WINDOW = 60 * 1000; // 1 minute in milliseconds

// // İn-memory rate limit data storage
// const rateLimits = new Map<string, RateLimitData>();

// export async function rateLimiter(req: NextRequest) {
//   const ip = req.headers.get('x-forwarded-for') || 'unknown-ip'; // Get the IP address from headers
//   const now = Date.now();

//   let rateLimitData = rateLimits.get(ip);
//  console.log("rate limiter running started");
//   // If the Ip has never made a requestt before, create a new entry
//   if (!rateLimitData) {
//     rateLimitData = {
//       lastRequestTime: now,
//       requestCount: 1, // First request
//     };
//     rateLimits.set(ip, rateLimitData);
//     return NextResponse.next(); // Allow the first request
//   }

//     // If the time window has passed, reset the counter
//   if (now - rateLimitData.lastRequestTime > TIME_WINDOW) {
//     rateLimitData.lastRequestTime = now;
//     rateLimitData.requestCount = 1; // start a new time window
//   } else {
//     // If the time window has not passed, increment the request count
//     rateLimitData.requestCount += 1;
//   }

//    // If the request count exceeds the limit, return an error response
//   if (rateLimitData.requestCount > RATE_LIMIT) {
//     return new NextResponse(
//       JSON.stringify({ message: 'Çok fazla istek! Lütfen biraz bekleyin.' }),
//       {
//         status: 429, // Too Many Requests
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }

//   rateLimits.set(ip, rateLimitData); // Update the rate limit data
//  console.log("rate limiter running ended");
//   return NextResponse.next(); // Proceed with the request
// }

// // Specify which routes the middleware should apply to
// export const config = {
//   matcher: '/:path*', // Apply to all routes
// };

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitData {
  lastRequestTime: number;
  requestCount: number;
}

const RATE_LIMIT = 10; // Number of requests allowed within 1 minute
const TIME_WINDOW = 60 * 1000; // 1 minute in milliseconds

// In-memory rate limit data storage
const rateLimits = new Map<string, RateLimitData>();

export async function rateLimiter(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown-ip'; // Get the IP address from headers
  const now = Date.now();

  let rateLimitData = rateLimits.get(ip);
  console.log("rate limiter running started");

  // If the IP has never made a request before, create a new entry
  if (!rateLimitData) {
    rateLimitData = {
      lastRequestTime: now,
      requestCount: 1, // First request
    };
    rateLimits.set(ip, rateLimitData);
    console.log("rate limiter running ended - first request");
    return NextResponse.next(); // Allow the first request
  }

  // If the time window has passed, reset the counter
  if (now - rateLimitData.lastRequestTime > TIME_WINDOW) {
    rateLimitData.lastRequestTime = now;
    rateLimitData.requestCount = 1; // Start a new time window
  } else {
    // If the time window has not passed, increment the request count
    rateLimitData.requestCount += 1;
  }

  // If the request count exceeds the limit, return an error response
  if (rateLimitData.requestCount > RATE_LIMIT) {
    console.log("rate limit exceeded");
    return new NextResponse(
      JSON.stringify({ message: 'Çok fazla istek! Lütfen biraz bekleyin.' }),
      {
        status: 429, // Too Many Requests
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  rateLimits.set(ip, rateLimitData); // Update the rate limit data
  console.log("rate limiter running ended");
  return NextResponse.next(); // Proceed with the request
}

// Specify which routes the middleware should apply to
export const config = {
  matcher: '/:path*', // Apply to all routes
};
