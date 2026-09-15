"use client";

export function DateSwitch({
  onSwap,
  disabled,
}: {
  onSwap: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label="Swap"
      title="Swap"
      disabled={disabled}
      onClick={onSwap}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-accent-soft hover:text-accent disabled:opacity-40"
    >
      <SwapIcon />
    </button>
  );
}

function SwapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M7 8h11.5M16 5.5 18.5 8 16 10.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 16H5.5M8 13.5 5.5 16 8 18.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
