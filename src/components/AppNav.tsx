import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export async function AppNav() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-surface/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm text-white">
            TA
          </span>
          Voyage
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <Link href="/dashboard" className="rounded-full px-3 py-1.5 hover:bg-accent-soft">
                Dashboard
              </Link>
              <Link href="/flights" className="rounded-full px-3 py-1.5 hover:bg-accent-soft">
                Flights
              </Link>
              <Link href="/control" className="rounded-full px-3 py-1.5 hover:bg-accent-soft">
                Control
              </Link>
              <Link
                href="/trips/new"
                className="rounded-full bg-accent px-4 py-1.5 font-medium text-white hover:opacity-90"
              >
                New trip
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="rounded-full px-3 py-1.5 text-muted hover:bg-line">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-3 py-1.5 hover:bg-accent-soft">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-accent px-4 py-1.5 font-medium text-white hover:opacity-90"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
