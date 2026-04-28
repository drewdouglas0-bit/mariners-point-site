"use client";

import { FormEvent, useState } from "react";
import AdminShell from "../components/AdminShell";
import { formatTime, statusClasses } from "../components/format";

type SearchBooking = {
  id: string;
  confirmation_code: string;
  status: string;
  player_count: number;
  player_breakdown: Record<string, number>;
  total_price: number;
  estimated_adjustment: number;
  notes: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  tee_times: {
    date: string;
    start_time: string;
    status: string;
  } | null;
  golfers: {
    id: string;
    name: string;
    email: string;
    phone: string;
    no_show_count: number;
    is_flagged: boolean;
  } | null;
};

export default function AdminBookingsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SearchBooking | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  async function onSearch(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/bookings/search?q=${encodeURIComponent(query)}`, {
        cache: "no-store",
      });

      const payload = (await response.json()) as { results?: SearchBooking[]; error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Search failed");
      }

      setResults(payload.results ?? []);
      setSelected(null);
    } catch {
      setError("Unable to search bookings.");
    } finally {
      setLoading(false);
    }
  }

  async function updateBooking(bookingId: string, action: "complete" | "no-show") {
    setError(null);
    const response = await fetch(`/api/admin/bookings/${bookingId}/${action}`, { method: "POST" });
    if (!response.ok) {
      setError("Unable to update booking.");
      return;
    }
    await refreshCurrentSearch();
  }

  async function cancelBooking() {
    if (!selected) return;

    setError(null);
    const response = await fetch(`/api/admin/bookings/${selected.id}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: cancelReason }),
    });

    if (!response.ok) {
      setError("Unable to cancel booking.");
      return;
    }

    setCancelReason("");
    await refreshCurrentSearch();
  }

  async function refreshCurrentSearch() {
    if (!query.trim()) return;
    const response = await fetch(`/api/admin/bookings/search?q=${encodeURIComponent(query)}`, {
      cache: "no-store",
    });
    const payload = (await response.json()) as { results?: SearchBooking[] };
    const next = payload.results ?? [];
    setResults(next);
    if (selected) {
      setSelected(next.find((item) => item.id === selected.id) ?? null);
    }
  }

  return (
    <AdminShell title="Bookings">
      <form onSubmit={onSearch} className="rounded-lg border border-slate-200 bg-white p-4">
        <label htmlFor="query" className="mb-2 block text-sm font-medium text-slate-700">
          Search by confirmation code, golfer name, or email
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="MP-4821, Jane Doe, jane@example.com"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 font-medium">Code</th>
                <th className="px-3 py-2 font-medium">Golfer</th>
                <th className="px-3 py-2 font-medium">Tee Time</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((booking) => (
                <tr
                  key={booking.id}
                  onClick={() => setSelected(booking)}
                  className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-3 py-3">{booking.confirmation_code}</td>
                  <td className="px-3 py-3">{booking.golfers?.name ?? "Unknown"}</td>
                  <td className="px-3 py-3">
                    {booking.tee_times
                      ? `${booking.tee_times.date} ${formatTime(booking.tee_times.start_time)}`
                      : "N/A"}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClasses(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && results.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-slate-500">
                    No results.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          {selected ? (
            <>
              <h3 className="text-lg font-semibold text-slate-900">Booking Details</h3>
              <div className="mt-3 space-y-1 text-sm text-slate-700">
                <p><strong>Golfer:</strong> {selected.golfers?.name}</p>
                <p><strong>Email:</strong> {selected.golfers?.email}</p>
                <p><strong>Phone:</strong> {selected.golfers?.phone}</p>
                <p><strong>Players:</strong> {selected.player_count}</p>
                <p><strong>Breakdown:</strong> {JSON.stringify(selected.player_breakdown)}</p>
                <p><strong>Notes:</strong> {selected.notes || "—"}</p>
                <p><strong>Status:</strong> {selected.status}</p>
              </div>

              <div className="mt-4 space-y-3">
                {selected.status === "confirmed" ? (
                  <>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void updateBooking(selected.id, "complete")}
                        className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
                      >
                        Mark Complete
                      </button>
                      <button
                        type="button"
                        onClick={() => void updateBooking(selected.id, "no-show")}
                        className="rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
                      >
                        Mark No Show
                      </button>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Cancel reason</label>
                      <input
                        value={cancelReason}
                        onChange={(event) => setCancelReason(event.target.value)}
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                        placeholder="Reason for cancellation"
                      />
                      <button
                        type="button"
                        onClick={() => void cancelBooking()}
                        className="mt-2 rounded bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">No actions available for this status.</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">Select a booking to view full details.</p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
