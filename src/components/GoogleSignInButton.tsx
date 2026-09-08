"use client";

import { signIn } from "next-auth/react";

export function GoogleSignInButton({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;

  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium dark:border-zinc-800"
    >
      Continue with Google
    </button>
  );
}
