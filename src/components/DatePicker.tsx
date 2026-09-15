"use client";

import { DateInput } from "@/components/DateInput";

type DatePickerProps = {
  id: string;
  label: string;
  value: string;
  min?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

export function DatePicker({
  id,
  label,
  value,
  min,
  required,
  onChange,
}: DatePickerProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <DateInput id={id} value={value} min={min} required={required} onChange={onChange} />
    </label>
  );
}
