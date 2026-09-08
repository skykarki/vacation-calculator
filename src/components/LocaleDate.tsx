"use client";

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
      {date.toLocaleDateString()}
    </time>
  );
}
