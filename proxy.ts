import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all paths except API, Next internals, static files,
  // and SEO route handlers (sitemap, robots, llms, manifest)
  matcher: [
    "/((?!api|_next|_vercel|sitemap.xml|robots.txt|llms.txt|manifest.webmanifest|favicon.ico|.*\\..*).*)",
  ],
};
