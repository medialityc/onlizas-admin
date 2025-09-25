import { initSSO } from "zas-sso-client";

export const { middleware, config, handlers } = initSSO({
  protectedRoutes: ["/dashboard"],
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  redirectUri: "/dashboard",
});
