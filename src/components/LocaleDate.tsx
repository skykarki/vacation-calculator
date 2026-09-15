"use client";

import { formatDmy } from "@/lib/date-utils";

export function LocaleDate({
  value,
  className,
}: {
  value: string | Date;
  className?: string;
}) {
  const date = new Date(value);
  return (
    <time dateTime={date.toISOString()} className={className}>
      {formatDmy(date)}
    </time>
  );
}
