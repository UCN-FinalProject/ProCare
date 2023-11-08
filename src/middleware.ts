export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/patients/:path*",
    "/doctors/:path*",
    "/healthcare-providers/:path*",
    "/insurance-providers/:path*",
    "/procedures/:path*",
    "/diagnoses/:path*",
    "/users/:path*",
    "/settings/:path*",
  ],
};
