"use client";

import { useEffect, useState } from "react";
import AdminShell from "../components/AdminShell";
import { formatTime } from "../components/format";
import type { TeeSheetSlot } from "../components/types";

export default function TeeSheetPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<TeeSheetSlot[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const response = await fetch(`/api/admin/tee-sheet?date=${date}`, { cache: "no-store" });
      const payload = (await response.json()) as { slots?: TeeSheetSlot[]; error?: string };

      if (!active) return;
      if (!response.ok) {
        setError(payload.error ?? "Unable to load tee sheet.");
        return;
      }

      setError(null);
      setSlots(payload.slots ?? []);
    };
    void load();
    return () => {
      active = false;
    };
  }, [date]);

  async function load(selectedDate: string) {
    const response = await fetch(`/api/admin/tee-sheet?date=${selectedDate}`, { cache: "no-store" });
    const payload = (await response.json()) as { slots?: TeeSheetSlot[]; error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Unable to load tee sheet.");
      return;
    }

    setError(null);
    setSlots(payload.slots ?? []);
  }

  async function quickBlock(slot: TeeSheetSlot) {
    const response = await fetch("/api/admin/block-times", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        start_time: slot.start_time,
        end_time: slot.start_time,
        reason: "Manual block",
      }),
    });

    if (!response.ok) {
      setError("Unable to block slot.");
      return;
    }

    await load(date);
  }

  async function quickUnblock(slot: TeeSheetSlot) {
    const blockResponse = await fetch("/api/admin/block-times", { cache: "no-store" });
    const blockPayload = (await blockResponse.json()) as {
      blocks?: { id: string; start_datetime: string; end_datetime: string }[];
    };
    const block = (blockPayload.blocks ?? []).find((item) => {
      const start = new Date(item.start_datetime);
      const end = new Date(item.end_datetime);
      const current = new Date(`${slot.date}T${slot.start_time}`);
      return current >= start && current <= end;
    });

    if (!block?.id) {
      setError("Unable to locate block record for this slot.");
      return;
    }

    const response = await fetch("/api/admin/unblock-times", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ block_id: block.id }),
    });

    if (!response.ok) {
      setError("Unable to unblock slot.");
      return;
    }

    await load(date);
  }

  function shiftDate(days: number) {
    const base = new Date(`${date}T00:00:00`);
    base.setDate(base.getDate() + days);
    setDate(base.toISOString().slice(0, 10));
  }

  return (
    <AdminShell title="Tee Sheet">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => shiftDate(-1)}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            ← Previous day
          </button>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => shiftDate(1)}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            Next day →
          </button>
        </div>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <div className="mt-4 space-y-2">
          {slots.map((slot) => {
            const visualClass =
              slot.status === "available"
                ? "bg-green-50"
                : slot.status === "booked"
                  ? "bg-amber-100"
                  : slot.status === "blocked"
                    ? "bg-red-100"
                    : "bg-slate-200";

            return (
              <div
                key={slot.id}
                className={`flex flex-wrap items-center justify-between rounded border border-slate-200 px-3 py-2 ${visualClass}`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-20 text-sm font-semibold text-slate-700">{formatTime(slot.start_time)}</span>
                  <div className="text-sm text-slate-700">
                    {slot.status === "booked" && slot.booking
                      ? `${slot.booking.golfer?.name ?? "Unknown golfer"} (${slot.booking.player_count} players)`
                      : slot.status === "blocked"
                        ? `Blocked: ${slot.blocked_reason ?? "No reason"}`
                        : slot.status === "closed"
                          ? "Closed"
                          : "Available"}
                  </div>
                </div>

                <div>
                  {slot.status === "available" ? (
                    <button
                      type="button"
                      onClick={() => void quickBlock(slot)}
                      className="rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white"
                    >
                      Block
                    </button>
                  ) : null}

                  {slot.status === "blocked" ? (
                    <button
                      type="button"
                      onClick={() => void quickUnblock(slot)}
                      className="rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white"
                    >
                      Unblock
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}
