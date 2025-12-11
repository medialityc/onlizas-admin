import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { withSSO } from './src/middlewares/sso';
// Note: Next.js (Turbopack) requires a statically analyzable config object.
// Do not re-export a computed config; provide a literal here.

const handler = withSSO;

export async function middleware(req: NextRequest) {
	// Ensure we always return a valid NextResponse
	const res = await handler(req, {} as any);
	return res instanceof NextResponse ? res : NextResponse.next();
}

// Protect only dashboard paths; adjust as needed.
export const config = {
	matcher: ['/dashboard/:path*'],
};
