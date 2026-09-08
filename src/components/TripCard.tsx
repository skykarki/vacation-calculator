import Link from "next/link";
import { LocaleDate } from "@/components/LocaleDate";
import { tripPalette, tripStatus } from "@/lib/trip-style";

type TripCardProps = {
  id: string;
  title: string;
  destination: string;
  startDate: string | Date;
  endDate: string | Date;
  totalDays: number;
};

export function TripCard({
  id,
  title,
  destination,
  startDate,
  endDate,
  totalDays,
}: TripCardProps) {
  const [from, to] = tripPalette(`${title}-${destination}`);
  const status = tripStatus(startDate, endDate);

  return (
    <Link
      href={`/trips/${id}`}
      className="group overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className="h-20 px-4 py-3 text-white"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <p className="text-xs uppercase tracking-[0.18em] opacity-80">Destination</p>
        <p className="truncate text-lg font-semibold">{destination}</p>
      </div>
      <div className="flex items-start justify-between gap-4 p-4">
        <div>
          <p className="font-semibold group-hover:text-accent">{title}</p>
          <p className="mt-1 text-sm text-muted">
            <LocaleDate value={startDate} /> – <LocaleDate value={endDate} />
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
            {status}
          </span>
          <p className="mt-2 text-sm text-muted">{totalDays} days</p>
        </div>
      </div>
    </Link>
  );
}
