import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth({
  ...authConfig,
  providers: [],
});

export function proxy(...args: Parameters<typeof auth>) {
  return auth(...args);
}

export const config = {
  matcher: ["/dashboard/:path*", "/trips/:path*", "/control/:path*"],
};
