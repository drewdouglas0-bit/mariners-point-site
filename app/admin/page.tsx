"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "./components/AdminShell";
import { formatDateHeading, formatTime, statusClasses } from "./components/format";
import type { TeeSheetSlot } from "./components/types";

type TodayData = {
  date: string;
  slots: TeeSheetSlot[];
};

export default function AdminTodayPage() {
  const [data, setData] = useState<TodayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadToday = async () => {
      try {
        const date = new Date().toISOString().slice(0, 10);
        const response = await fetch(`/api/admin/tee-sheet?date=${date}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load");
        const payload = (await response.json()) as TodayData;
        if (!active) return;
        setData(payload);
        setError(null);
      } catch {
        if (!active) return;
        setError("Unable to load today view.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadToday();
    const timer = setInterval(() => void loadToday(), 60_000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const bookings = useMemo(() => {
    if (!data) return [];
    return data.slots
      .filter((slot) => slot.booking)
      .map((slot) => ({ slot, booking: slot.booking! }))
      .sort((a, b) => a.slot.start_time.localeCompare(b.slot.start_time));
  }, [data]);

  const totalBookings = bookings.length;
  const totalPlayers = bookings.reduce((sum, item) => sum + item.booking.player_count, 0);
  const totalNoShows = bookings.filter((item) => item.booking.status === "no_show").length;

  async function updateBooking(bookingId: string, action: "complete" | "no-show") {
    setUpdatingId(bookingId);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/${action}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Action failed");
      }

      const date = new Date().toISOString().slice(0, 10);
      const refresh = await fetch(`/api/admin/tee-sheet?date=${date}`, { cache: "no-store" });
      if (!refresh.ok) throw new Error("Refresh failed");
      const payload = (await refresh.json()) as TodayData;
      setData(payload);
    } catch {
      setError("Action failed. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminShell title="Today">
      <p className="text-sm text-slate-600">{formatDateHeading(new Date())}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total bookings today" value={totalBookings} />
        <StatCard label="Players expected today" value={totalPlayers} />
        <StatCard label="No-shows marked today" value={totalNoShows} />
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 font-medium">Tee Time</th>
              <th className="px-3 py-2 font-medium">Golfer</th>
              <th className="px-3 py-2 font-medium">Players</th>
              <th className="px-3 py-2 font-medium">Confirmation</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                  No bookings for today.
                </td>
              </tr>
            ) : null}

            {bookings.map(({ slot, booking }) => {
              const golferName = booking.golfer?.name ?? "Unknown golfer";
              return (
                <tr key={booking.id} className="border-t border-slate-100">
                  <td className="px-3 py-3">{formatTime(slot.start_time)}</td>
                  <td className="px-3 py-3">{golferName}</td>
                  <td className="px-3 py-3">{booking.player_count} players</td>
                  <td className="px-3 py-3">{booking.confirmation_code}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClasses(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {booking.status === "confirmed" ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void updateBooking(booking.id, "complete")}
                          disabled={updatingId === booking.id}
                          className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-60"
                        >
                          Complete
                        </button>
                        <button
                          type="button"
                          onClick={() => void updateBooking(booking.id, "no-show")}
                          disabled={updatingId === booking.id}
                          className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-60"
                        >
                          No Show
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">No actions</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
