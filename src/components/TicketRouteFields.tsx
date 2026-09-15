"use client";

import { AirportPicker } from "@/components/AirportPicker";
import { DateSwitch } from "@/components/DateSwitch";

export function TicketRouteFields({
  originId,
  destinationId,
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onSwap,
  required,
}: {
  originId: string;
  destinationId: string;
  origin: string;
  destination: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onSwap: () => void;
  required?: boolean;
}) {
  return (
    <div className="relative flex items-stretch overflow-visible rounded-xl border border-line bg-surface">
      <AirportPicker
        id={originId}
        label="From"
        value={origin}
        required={required}
        onChange={onOriginChange}
      />
      <div className="flex items-center border-x border-line px-1">
        <DateSwitch onSwap={onSwap} disabled={!origin && !destination} />
      </div>
      <AirportPicker
        id={destinationId}
        label="To"
        value={destination}
        required={required}
        onChange={onDestinationChange}
      />
    </div>
  );
}
