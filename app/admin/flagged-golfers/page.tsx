"use client";

import { useEffect, useState } from "react";
import AdminShell from "../components/AdminShell";
import type { FlaggedGolfer } from "../components/types";

export default function FlaggedGolfersPage() {
  const [golfers, setGolfers] = useState<FlaggedGolfer[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/admin/flagged-golfers", { cache: "no-store" });
    const payload = (await response.json()) as { golfers?: FlaggedGolfer[]; error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Unable to load flagged golfers.");
      return;
    }

    setGolfers(payload.golfers ?? []);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  async function unflag(golferId: string) {
    const note = notes[golferId] ?? "";
    const response = await fetch(`/api/admin/golfers/${golferId}/unflag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });

    if (!response.ok) {
      setError("Unable to unflag golfer.");
      return;
    }

    await load();
  }

  return (
    <AdminShell title="Flagged Golfers">
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Phone</th>
              <th className="px-3 py-2 font-medium">No-shows</th>
              <th className="px-3 py-2 font-medium">Flag reason</th>
              <th className="px-3 py-2 font-medium">Last booking</th>
              <th className="px-3 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {golfers.map((golfer) => (
              <tr key={golfer.id} className="border-t border-slate-100 align-top">
                <td className="px-3 py-3">{golfer.name}</td>
                <td className="px-3 py-3">{golfer.email}</td>
                <td className="px-3 py-3">{golfer.phone}</td>
                <td className="px-3 py-3">{golfer.no_show_count}</td>
                <td className="px-3 py-3">{golfer.flagged_reason ?? "—"}</td>
                <td className="px-3 py-3">
                  {golfer.last_booking_at
                    ? new Date(golfer.last_booking_at).toLocaleString()
                    : "—"}
                </td>
                <td className="px-3 py-3">
                  <input
                    value={notes[golfer.id] ?? ""}
                    onChange={(event) =>
                      setNotes((prev) => ({ ...prev, [golfer.id]: event.target.value }))
                    }
                    placeholder="Optional note"
                    className="mb-2 w-full rounded border border-slate-300 px-2 py-1"
                  />
                  <button
                    type="button"
                    onClick={() => void unflag(golfer.id)}
                    className="rounded bg-slate-900 px-3 py-1 text-xs font-medium text-white"
                  >
                    Unflag
                  </button>
                </td>
              </tr>
            ))}
            {golfers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-slate-500">
                  No flagged golfers.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
