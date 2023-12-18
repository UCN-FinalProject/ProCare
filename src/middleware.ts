export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/api/reports/:path*",
    // "/report-test/:path*",
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
