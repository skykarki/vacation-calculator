"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AccountSettings({
  name,
  email,
  hasPassword,
}: {
  name: string;
  email: string;
  hasPassword: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name,
    email,
    currentPassword: "",
    newPassword: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        currentPassword: form.currentPassword || undefined,
        newPassword: form.newPassword || undefined,
      }),
    });

    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not update account");
      return;
    }

    setForm((current) => ({ ...current, currentPassword: "", newPassword: "" }));
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Name</span>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-md border border-line bg-surface px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Email</span>
        <input
          type="email"
          value={form.email}
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-md border border-line bg-surface px-3 py-2"
        />
      </label>
      {hasPassword ? (
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Current password</span>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            className="rounded-md border border-line bg-surface px-3 py-2"
          />
        </label>
      ) : null}
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">{hasPassword ? "New password" : "Set password"}</span>
        <input
          type="password"
          minLength={8}
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          className="rounded-md border border-line bg-surface px-3 py-2"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm text-accent">Account updated.</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save account"}
      </button>
    </form>
  );
}
