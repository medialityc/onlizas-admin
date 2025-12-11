import { middleware } from "@/sso";

export const withSSO: any = (next: any) => async (req: any, event: any) => {
  const res = await middleware(req);
  if (res.status !== 200) {
    return res;
  }
  return next(req, event);
};
