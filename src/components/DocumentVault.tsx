"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type TravelDocument = {
  id: string;
  title: string;
  category: string;
  fileName: string;
  filePath: string;
};

export function DocumentVault({
  tripId,
  documents,
}: {
  tripId: string;
  documents: TravelDocument[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("ticket");
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Choose a file");
      return;
    }
    setPending(true);
    setError("");
    const form = new FormData();
    form.append("title", title);
    form.append("category", category);
    form.append("file", file);
    const res = await fetch(`/api/trips/${tripId}/documents`, {
      method: "POST",
      body: form,
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not upload document");
      return;
    }
    setTitle("");
    setFile(null);
    router.refresh();
  }

  async function remove(documentId: string) {
    setPending(true);
    const res = await fetch(`/api/trips/${tripId}/documents/${documentId}`, {
      method: "DELETE",
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not delete document");
      return;
    }
    router.refresh();
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Documents</h2>
      <ul className="space-y-2 text-sm">
        {documents.length === 0 ? (
          <li className="text-gray-500">No tickets or confirmations yet.</li>
        ) : (
          documents.map((document) => (
            <li key={document.id} className="flex items-center justify-between gap-3 rounded border p-3">
              <div>
                <p className="font-medium">{document.title}</p>
                <p className="text-gray-500">
                  {document.category} · {document.fileName}
                </p>
              </div>
              <span className="flex gap-2">
                <a href={document.filePath} className="underline" target="_blank" rel="noreferrer">
                  Open
                </a>
                <button
                  type="button"
                  className="underline text-red-700"
                  onClick={() => remove(document.id)}
                >
                  Delete
                </button>
              </span>
            </li>
          ))
        )}
      </ul>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title"
          required
          className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        >
          <option value="ticket">Flight ticket</option>
          <option value="hotel">Hotel confirmation</option>
          <option value="insurance">Insurance</option>
          <option value="visa">Visa</option>
          <option value="other">Other</option>
        </select>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {pending ? "Uploading..." : "Upload document"}
        </button>
      </form>
    </section>
  );
}
