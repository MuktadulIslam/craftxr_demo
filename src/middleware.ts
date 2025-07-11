// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticatedFromRequest } from '@/utils/authToken';
import { config } from '@/config';

// Define which routes are protected (require authentication)
const protectedRoutes = [
    config.routePaths.profile,
    config.routePaths.evaluations,
    config.routePaths.simulations,
    config.routePaths.programs,
];
// Define which routes are for non-authenticated users only
const authRoutes = [config.routePaths.login, config.routePaths.signup];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    // console.log("first print path",path);
    if (path.startsWith('/_next')) return NextResponse.next();
    // console.log("second print path",path);

    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route)) || path === config.routePaths.dashboard;
    // Check if the route is for non-authenticated users
    const isAuthRoute = authRoutes.some(route => path.startsWith(route));

    // Pass the request object to the authentication check
    const isUserAuthenticated = isAuthenticatedFromRequest(request);
    // For protected routes, redirect to login if not authenticated
    if (isProtectedRoute && !isUserAuthenticated) {
        const url = new URL(config.routePaths.login, request.url);
        url.searchParams.set(config.callbackUrlName, request.nextUrl.pathname + request.nextUrl.search);
        return NextResponse.redirect(url);
    }
    else if (isAuthRoute && isUserAuthenticated) {
        return NextResponse.redirect(new URL(config.routePaths.dashboard, request.url));
    }
    return NextResponse.next();
}



export const middlewareConfig = {
    matcher: [config.routePaths.dashboard, config.routePaths.login],
};