import { MiddlewareFactory } from '@/lib/chain-middleware';
import { middleware } from '@/sso';

export const withSSO: MiddlewareFactory = (next) => async (req, event) => {
	const res = await middleware(req);
	if (res.status !== 200) {
		return res;
	}
	return next(req, event);
};
