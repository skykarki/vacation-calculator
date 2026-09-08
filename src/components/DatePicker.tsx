"use client";

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
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-zinc-200 bg-transparent px-3 py-2 dark:border-zinc-800"
      />
    </label>
  );
}
