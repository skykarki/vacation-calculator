import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-6 rounded-2xl bg-white p-10 dark:bg-zinc-950">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Travel app
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Plan trips, track days, keep itineraries in one place.
        </h1>
        <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Next.js, Prisma, PostgreSQL, and NextAuth are wired up. Sign in to
          manage your trips.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            Open dashboard
          </Link>
          <Link
            href="/flights"
            className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium dark:border-zinc-800"
          >
            Book flights
          </Link>
          <Link
            href="/trips"
            className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium dark:border-zinc-800"
          >
            View trips
          </Link>
          <Link
            href="/trips/new"
            className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium dark:border-zinc-800"
          >
            New trip
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium dark:border-zinc-800"
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
