"use client";

import { DateInput } from "@/components/DateInput";
import { DateSwitch } from "@/components/DateSwitch";

export function DateRangeFields({
  startId,
  endId,
  startValue,
  endValue,
  startRequired,
  onStartChange,
  onEndChange,
  onSwap,
}: {
  startId: string;
  endId: string;
  startValue: string;
  endValue: string;
  startRequired?: boolean;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onSwap: () => void;
}) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-xl border border-line bg-surface">
      <label htmlFor={startId} className="flex min-w-0 flex-1 flex-col gap-1 px-3 py-2">
        <span className="text-xs text-muted">Start date</span>
        <DateInput
          id={startId}
          value={startValue}
          required={startRequired}
          className="w-full bg-transparent text-sm outline-none"
          onChange={onStartChange}
        />
      </label>
      <div className="flex items-center border-x border-line px-1">
        <DateSwitch onSwap={onSwap} disabled={!startValue && !endValue} />
      </div>
      <label htmlFor={endId} className="flex min-w-0 flex-1 flex-col gap-1 px-3 py-2">
        <span className="text-xs text-muted">End date</span>
        <DateInput
          id={endId}
          value={endValue}
          min={startValue || undefined}
          className="w-full bg-transparent text-sm outline-none"
          onChange={onEndChange}
        />
      </label>
    </div>
  );
}
