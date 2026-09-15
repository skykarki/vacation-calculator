"use client";

import { useState } from "react";
import { formatDmy, parseToIsoDate } from "@/lib/date-utils";

export function DateInput({
  id,
  value,
  min,
  required,
  className = "h-10 w-full rounded-md border border-line bg-surface px-3 py-2",
  onChange,
}: {
  id?: string;
  value: string;
  min?: string;
  required?: boolean;
  className?: string;
  onChange: (value: string) => void;
}) {
  const formatted = value ? formatDmy(value) : "";
  const [draft, setDraft] = useState("");
  const parsedDraft = parseToIsoDate(draft);
  const text = draft !== "" && parsedDraft === null ? draft : formatted;

  function handleChange(raw: string) {
    setDraft(raw);
    if (raw.trim() === "") {
      onChange("");
      return;
    }
    const iso = parseToIsoDate(raw);
    if (!iso) return;
    setDraft("");
    if (min && iso < min) {
      onChange(min);
      return;
    }
    onChange(iso);
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      placeholder="DD-MM-YYYY"
      value={text}
      required={required}
      onChange={(event) => handleChange(event.target.value)}
      className={className}
    />
  );
}
