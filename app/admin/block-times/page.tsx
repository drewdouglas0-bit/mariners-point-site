"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import AdminShell from "../components/AdminShell";

function timeOptions() {
  const values: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      values.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`);
    }
  }
  return values;
}

export default function BlockTimesPage() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const times = useMemo(() => timeOptions(), []);

  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("07:00:00");
  const [endTime, setEndTime] = useState("08:00:00");
  const [reason, setReason] = useState("");
  const [blocks, setBlocks] = useState<
    {
      id: string;
      start_datetime: string;
      end_datetime: string;
      reason: string;
    }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  async function loadBlocks() {
    const response = await fetch("/api/admin/block-times", { cache: "no-store" });
    const payload = (await response.json()) as {
      blocks?: { id: string; start_datetime: string; end_datetime: string; reason: string }[];
      error?: string;
    };

    if (!response.ok) {
      setError(payload.error ?? "Unable to load blocks.");
      return;
    }

    setBlocks(payload.blocks ?? []);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadBlocks();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const response = await fetch("/api/admin/block-times", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        start_time: startTime,
        end_time: endTime,
        reason,
      }),
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Unable to block slots.");
      return;
    }

    setReason("");
    await loadBlocks();
  }

  async function unblock(blockId: string) {
    const response = await fetch("/api/admin/unblock-times", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ block_id: blockId }),
    });

    if (!response.ok) {
      setError("Unable to unblock range.");
      return;
    }

    await loadBlocks();
  }

  return (
    <AdminShell title="Block Times">
      <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm text-slate-700">
            Date
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-1 block w-full rounded border border-slate-300 px-2 py-2"
            />
          </label>

          <label className="text-sm text-slate-700">
            Start time
            <select
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="mt-1 block w-full rounded border border-slate-300 px-2 py-2"
            >
              {times.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-slate-700">
            End time
            <select
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className="mt-1 block w-full rounded border border-slate-300 px-2 py-2"
            >
              {times.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-slate-700 sm:col-span-2 lg:col-span-1">
            Reason
            <input
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Maintenance"
              className="mt-1 block w-full rounded border border-slate-300 px-2 py-2"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Block slots
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Upcoming blocks</h3>
        <div className="mt-3 space-y-2">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="flex flex-wrap items-center justify-between rounded border border-slate-200 px-3 py-2 text-sm"
            >
              <span>
                {new Date(block.start_datetime).toLocaleString()} - {new Date(block.end_datetime).toLocaleString()} ({block.reason})
              </span>
              <button
                type="button"
                onClick={() => void unblock(block.id)}
                className="rounded bg-slate-900 px-3 py-1 text-xs font-medium text-white"
              >
                Unblock
              </button>
            </div>
          ))}
          {blocks.length === 0 ? <p className="text-sm text-slate-500">No upcoming blocks.</p> : null}
        </div>
      </div>
    </AdminShell>
  );
}
