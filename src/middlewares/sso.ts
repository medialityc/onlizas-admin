import { middleware } from "@/sso";

export const withSSO: any = (next: any) => async (req: any, event: any) => {
  const ssoRes = await middleware(req);
  if (ssoRes.status !== 200) {
    return ssoRes;
  }

  for (const cookie of ssoRes.cookies.getAll()) {
    req.cookies.set(cookie.name, cookie.value);
  }

  const res = await next(req, event);

  // Copiar las cookies del SSO middleware a la respuesta final
  for (const cookie of ssoRes.cookies.getAll()) {
    res.cookies.set(cookie);
  }

  return res;
};
