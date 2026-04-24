"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  CreateBookingRequest,
  PlayerBreakdown,
  TeeTime,
} from "@/lib/types/booking";

type Players = 1 | 2 | 3 | 4;
type Step = 1 | 2 | 3 | 4 | 5;

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function buildDates(): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
}

function longDate(d: Date): string {
  return `${DAY[d.getDay()]}, ${MON[d.getMonth()]} ${d.getDate()}`;
}

function getToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function toDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function displayTime(startTime: string): string {
  const [hourString, minuteString] = startTime.split(":");
  const hours = Number(hourString);
  const minutes = Number(minuteString);
  const ampm = hours < 12 ? "AM" : "PM";
  const h12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${h12}:${String(minutes).padStart(2, "0")} ${ampm}`;
}

function slotLabel(startTime: string): string {
  const [hourString] = startTime.split(":");
  const hour = Number(hourString);
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  if (hour < 19) return "Twilight";
  return "Under the Lights";
}

function toPriceNumber(price: number | string): number {
  if (typeof price === "number") return price;
  const parsed = Number(price);
  return Number.isFinite(parsed) ? parsed : 23;
}

function getDefaultBreakdown(players: Players): PlayerBreakdown {
  return {
    standard: players,
    senior: 0,
    junior: 0,
    resident: 0,
    replay: 0,
    frequent_play: 0,
  };
}

function breakdownTotal(breakdown: PlayerBreakdown): number {
  return (
    breakdown.standard +
    breakdown.senior +
    breakdown.junior +
    breakdown.resident +
    breakdown.replay +
    breakdown.frequent_play
  );
}

function adjustedTotal(breakdown: PlayerBreakdown): number {
  const standard = breakdown.standard * 23;
  const discounted20 =
    (breakdown.senior + breakdown.junior + breakdown.resident) * 20;
  const discounted16 =
    (breakdown.replay + breakdown.frequent_play) * 16;

  return standard + discounted20 + discounted16;
}

function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

function StepDate({ date, onSelect }: { date: Date; onSelect: (d: Date) => void }) {
  const dates = buildDates();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1 text-cream">Select a date</h2>
      <p className="text-cream/45 text-sm mb-7">Available for the next 14 days</p>
      <div className="grid grid-cols-7 gap-2">
        {dates.map((d, i) => {
          const sel = d.toDateString() === date.toDateString();
          return (
            <button
              key={i}
              onClick={() => onSelect(d)}
              className={`min-h-[44px] flex flex-col items-center justify-center py-2.5 rounded transition-all duration-150 ${
                sel ? "bg-gold text-night" : "bg-cream/5 hover:bg-cream/10 text-cream"
              }`}
            >
              <span className={`text-[9px] uppercase tracking-wide ${sel ? "text-night/60" : "text-cream/40"}`}>
                {DAY[d.getDay()]}
              </span>
              <span className="text-base font-bold mt-0.5">{d.getDate()}</span>
              {i === 0 && !sel && <span className="w-1 h-1 rounded-full bg-gold mt-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepPlayers({ players, onSelect }: { players: Players; onSelect: (p: Players) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1 text-cream">How many players?</h2>
      <p className="text-cream/45 text-sm mb-7">Select your group size</p>
      <div className="grid grid-cols-4 gap-3">
        {([1, 2, 3, 4] as Players[]).map((n) => {
          const sel = players === n;
          return (
            <button
              key={n}
              onClick={() => onSelect(n)}
              className={`flex flex-col items-center justify-center h-24 rounded border transition-all duration-150 ${
                sel
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-cream/15 hover:border-cream/30 text-cream"
              }`}
            >
              <span className="text-3xl font-bold">{n}</span>
              <span className={`text-[11px] mt-1 ${sel ? "text-gold/70" : "text-cream/40"}`}>
                {n === 1 ? "player" : "players"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepTimes({
  date,
  players,
  teeTimes,
  selectedTeeTime,
  loading,
  error,
  bookingError,
  onRetry,
  onSelect,
}: {
  date: Date;
  players: Players;
  teeTimes: TeeTime[];
  selectedTeeTime: TeeTime | null;
  loading: boolean;
  error: string | null;
  bookingError: string | null;
  onRetry: () => void;
  onSelect: (slot: TeeTime) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1 text-cream">Choose a time</h2>
      <p className="text-cream/45 text-sm mb-5">
        {longDate(date)} · {players} {players === 1 ? "player" : "players"}
      </p>

      {loading && (
        <div className="border border-cream/10 rounded p-5 bg-cream/[0.03] flex items-center gap-3 text-sm text-cream/65">
          <span className="w-4 h-4 rounded-full border-2 border-cream/25 border-t-gold animate-spin" aria-hidden="true" />
          <span>Loading available times...</span>
        </div>
      )}

      {!loading && error && (
        <div className="border border-red-400/30 rounded p-4 bg-red-500/5">
          <p className="text-sm text-red-200 mb-3">{error}</p>
          <button
            onClick={onRetry}
            className="min-h-[44px] px-4 text-xs uppercase tracking-widest border border-cream/25 text-cream hover:border-gold hover:text-gold transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && teeTimes.length === 0 && (
        <p className="text-cream/45 text-sm border border-cream/10 rounded p-5 bg-cream/[0.03]">
          No available tee times for this date.
        </p>
      )}

      {!loading && !error && teeTimes.length > 0 && (
        <div>
          {teeTimes.map((slot, i) => {
            const newGroup = i === 0 || slotLabel(slot.start_time) !== slotLabel(teeTimes[i - 1].start_time);
            const selected = selectedTeeTime?.id === slot.id;
            const pricePerPlayer = toPriceNumber(slot.price_per_player);

            return (
              <div key={slot.id}>
                {newGroup && (
                  <p className="text-[10px] tracking-[0.2em] uppercase text-cream/30 pt-5 pb-2">
                    {slotLabel(slot.start_time)}
                  </p>
                )}
                <div
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-sm text-left transition-all duration-100 border-l-2 ${
                    selected
                      ? "bg-gold/10 border-gold"
                      : "hover:bg-cream/5 border-transparent"
                  }`}
                >
                  <div>
                    <p className={`text-sm font-medium ${selected ? "text-gold" : "text-cream"}`}>
                      {displayTime(slot.start_time)}
                    </p>
                    <p className={`text-sm font-semibold mt-1 ${selected ? "text-gold" : "text-cream/80"}`}>
                      ${pricePerPlayer.toFixed(2)} / player
                    </p>
                  </div>

                  <button
                    onClick={() => onSelect(slot)}
                    className={`min-h-[44px] px-4 text-[11px] uppercase tracking-widest transition-colors ${
                      selected
                        ? "bg-gold text-night"
                        : "border border-cream/25 text-cream hover:border-gold hover:text-gold"
                    }`}
                  >
                    {selected ? "Selected" : "Book"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {bookingError && (
        <p className="text-red-200 text-sm mt-4 border border-red-400/30 rounded p-3 bg-red-500/5">
          {bookingError}
        </p>
      )}
    </div>
  );
}

function StepDetails({
  form,
  setForm,
  playerBreakdown,
  setPlayerBreakdown,
  players,
  date,
  slot,
  bookingError,
}: {
  form: { name: string; email: string; phone: string; notes: string };
  setForm: (f: { name: string; email: string; phone: string; notes: string }) => void;
  playerBreakdown: PlayerBreakdown;
  setPlayerBreakdown: (updater: (prev: PlayerBreakdown) => PlayerBreakdown) => void;
  players: Players;
  date: Date;
  slot: TeeTime;
  bookingError: string | null;
}) {
  const breakdownRows: Array<{ key: keyof PlayerBreakdown; label: string; rateLabel: string }> = [
    { key: "standard", label: "Standard", rateLabel: "$23" },
    { key: "senior", label: "Senior", rateLabel: "$20" },
    { key: "junior", label: "Junior", rateLabel: "$20" },
    { key: "resident", label: "Foster City Resident", rateLabel: "$20" },
    { key: "replay", label: "Replay", rateLabel: "$16" },
    { key: "frequent_play", label: "Frequent Play Card", rateLabel: "$16" },
  ];

  const selectedTotal = breakdownTotal(playerBreakdown);
  const baseTotal = players * 23;
  const estimatedTotal = adjustedTotal(playerBreakdown);

  const updateBreakdownValue = (key: keyof PlayerBreakdown, rawValue: string) => {
    const parsed = Number(rawValue);
    const value = Number.isFinite(parsed) ? Math.max(0, Math.min(4, Math.trunc(parsed))) : 0;

    setPlayerBreakdown((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-xl font-semibold mb-1 text-cream">Player details</h2>
        <p className="text-cream/45 text-sm">Complete your booking details</p>
      </div>

      {bookingError && (
        <p className="text-red-200 text-sm border border-red-400/30 rounded p-3 bg-red-500/5">
          {bookingError}
        </p>
      )}

      <div className="space-y-5">
        {[
          { key: "name" as const, label: "Full Name", type: "text", placeholder: "Jane Smith" },
          { key: "email" as const, label: "Email Address", type: "email", placeholder: "jane@example.com" },
          { key: "phone" as const, label: "Phone Number", type: "tel", placeholder: "(650) 000-0000" },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-cream/40 mb-2">
              {label}
            </label>
            <input
              type={type}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={placeholder}
              className="w-full bg-cream/5 border border-cream/15 rounded px-4 py-3 text-sm text-cream placeholder:text-cream/20 focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
        ))}

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-cream/40 mb-2">
            Notes (optional)
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            placeholder="Any notes for the pro shop"
            className="w-full bg-cream/5 border border-cream/15 rounded px-4 py-3 text-sm text-cream placeholder:text-cream/20 focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      <div className="border border-cream/10 rounded p-5 space-y-4">
        <p className="text-[10px] uppercase tracking-widest text-cream/35">Player Breakdown</p>

        <div className="space-y-3">
          {breakdownRows.map(({ key, label, rateLabel }) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-cream">{label}</p>
                <p className="text-xs text-cream/45">{rateLabel} per player</p>
              </div>
              <input
                type="number"
                min={0}
                max={4}
                value={playerBreakdown[key]}
                onChange={(e) => updateBreakdownValue(key, e.target.value)}
                className="w-20 bg-cream/5 border border-cream/15 rounded px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold/50"
              />
            </div>
          ))}
        </div>

        <div className="border-t border-cream/10 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-cream/55">Selected players</span>
            <span className={selectedTotal === players ? "text-cream" : "text-red-200"}>
              {selectedTotal} / {players}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-cream/55">Online subtotal</span>
            <span className="text-cream">${baseTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cream/55">Estimated adjusted total</span>
            <span className="text-cream">${estimatedTotal.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-xs text-cream/45 leading-relaxed">
          Final rate adjustments made at the pro shop. Please bring valid ID or proof of eligibility for discounted rates.
        </p>
      </div>

      <div className="border border-cream/10 rounded p-5">
        <p className="text-[10px] uppercase tracking-widest text-cream/35 mb-4">Booking Summary</p>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-cream/50">Date</span>
            <span className="text-cream font-medium">{longDate(date)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-cream/50">Time</span>
            <span className="text-cream font-medium">{displayTime(slot.start_time)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-cream/50">Players</span>
            <span className="text-cream font-medium">{players}</span>
          </div>
          <div className="border-t border-cream/10 pt-3 flex justify-between">
            <span className="text-cream font-semibold text-sm">Total</span>
            <span className="font-bold text-gold">${(players * toPriceNumber(slot.price_per_player)).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepConfirm({
  date,
  players,
  slot,
  firstName,
  confirmationCode,
  onClose,
}: {
  date: Date;
  players: Players;
  slot: TeeTime;
  firstName: string;
  confirmationCode: string | null;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center pt-4">
      <div className="w-16 h-16 rounded-full border border-gold/50 flex items-center justify-center mb-6">
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gold"
        >
          <polyline points="19 5 8 16 3 11" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-cream">You&apos;re booked.</h2>
      <p className="text-cream/45 text-sm mb-6">
        {firstName ? `See you on the course, ${firstName}.` : "See you on the course."}
      </p>

      <div className="w-full border border-gold/35 rounded p-5 mb-6 bg-gold/5">
        <p className="text-[10px] uppercase tracking-widest text-gold/70 mb-2">Confirmation Code</p>
        <p className="text-2xl font-bold text-gold tracking-wider">{confirmationCode ?? "Pending"}</p>
      </div>

      <div className="w-full border border-cream/10 rounded p-5 text-left space-y-3 mb-5">
        <div className="flex justify-between text-sm">
          <span className="text-cream/50">Date</span>
          <span className="text-cream font-medium">{longDate(date)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cream/50">Time</span>
          <span className="text-cream font-medium">{displayTime(slot.start_time)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cream/50">Players</span>
          <span className="text-cream font-medium">{String(players)}</span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-gold text-night py-4 text-sm font-bold uppercase tracking-widest rounded hover:bg-gold-light transition-colors"
      >
        Done
      </button>
    </div>
  );
}

export function BookingPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [date, setDate] = useState<Date>(getToday);
  const [players, setPlayers] = useState<Players>(2);
  const [slot, setSlot] = useState<TeeTime | null>(null);
  const [teeTimes, setTeeTimes] = useState<TeeTime[]>([]);
  const [teeTimesLoading, setTeeTimesLoading] = useState(false);
  const [teeTimesError, setTeeTimesError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [playerBreakdown, setPlayerBreakdown] = useState<PlayerBreakdown>(
    getDefaultBreakdown(2),
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const fetchTeeTimes = useCallback(async (selectedDate: Date) => {
    setTeeTimesLoading(true);
    setTeeTimesError(null);

    try {
      const response = await fetch(`/api/tee-times?date=${toDateKey(selectedDate)}`, {
        cache: "no-store",
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || "Something went wrong, please try again.");
      }

      setTeeTimes(Array.isArray(payload) ? payload : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong, please try again.";
      setTeeTimesError(message);
      setTeeTimes([]);
    } finally {
      setTeeTimesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      void fetchTeeTimes(date);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isOpen, date, fetchTeeTimes]);

  const reset = useCallback(() => {
    setTimeout(() => {
      setStep(1);
      setDate(getToday());
      setPlayers(2);
      setSlot(null);
      setTeeTimes([]);
      setTeeTimesError(null);
      setBookingError(null);
      setSubmittingBooking(false);
      setConfirmationCode(null);
      setForm({ name: "", email: "", phone: "", notes: "" });
      setPlayerBreakdown(getDefaultBreakdown(2));
    }, 300);
  }, []);

  const close = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  const handleDateSelect = (d: Date) => {
    setDate(d);
    setSlot(null);
    setBookingError(null);
  };

  const handlePlayersSelect = (nextPlayers: Players) => {
    setPlayers(nextPlayers);
    setPlayerBreakdown(getDefaultBreakdown(nextPlayers));
    setBookingError(null);
  };

  const submitBooking = async () => {
    if (!slot) return;

    setSubmittingBooking(true);
    setBookingError(null);

    try {
      const payload: CreateBookingRequest = {
        tee_time_id: slot.id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        player_count: players,
        player_breakdown: playerBreakdown,
        notes: form.notes.trim() || undefined,
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseJson = await response.json().catch(() => null);

      if (!response.ok) {
        const message = responseJson?.error || "Something went wrong, please try again.";

        if (response.status === 409) {
          setBookingError(message);
          setStep(3);
          setSlot(null);
          await fetchTeeTimes(date);
          return;
        }

        if (response.status === 403) {
          setBookingError(message);
          return;
        }

        setBookingError(message);
        return;
      }

      setConfirmationCode(responseJson?.confirmation_code ?? null);
      setStep(5);
    } catch {
      setBookingError("Something went wrong, please try again.");
    } finally {
      setSubmittingBooking(false);
    }
  };

  const step3Valid = slot !== null;
  const formValid =
    form.name.trim().length > 0 &&
    isValidEmail(form.email.trim()) &&
    form.phone.trim().length >= 7 &&
    breakdownTotal(playerBreakdown) === players;

  const isStepValid =
    step === 3
      ? step3Valid
      : step === 4
        ? formValid && !submittingBooking
        : true;

  const advance = () => {
    if (step === 4) {
      void submitBooking();
      return;
    }

    if (step === 5) {
      close();
      return;
    }

    setStep((s) => (s + 1) as Step);
  };

  const ctaLabel =
    step === 4 ? (submittingBooking ? "Booking..." : "Confirm Booking") :
    step === 5 ? "Done" :
    "Continue";

  const showBack = step > 1 && step < 5;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 bg-black/60 z-[70] sm:z-[70] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Book a tee time"
        className={`fixed right-0 top-0 h-full w-full md:max-w-[480px] bg-navy z-[80] sm:z-[80] flex flex-col shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex-none px-4 sm:px-6 pt-[max(16px,env(safe-area-inset-top))] sm:pt-5 pb-4 border-b border-cream/10">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className={`text-xs text-cream/50 hover:text-cream transition-colors min-h-[44px] pr-4 ${
                showBack ? "" : "invisible pointer-events-none"
              }`}
            >
              ← Back
            </button>

            {step < 5 && (
              <span className="text-[10px] tracking-[0.2em] uppercase text-cream/30">
                Step {step} of 4
              </span>
            )}

            <button
              onClick={close}
              aria-label="Close booking panel"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-cream/50 hover:text-cream transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <line x1="1" y1="1" x2="13" y2="13" />
                <line x1="13" y1="1" x2="1" y2="13" />
              </svg>
            </button>
          </div>

          {step < 5 && (
            <div className="flex gap-1.5" aria-hidden="true">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${
                    s <= step ? "bg-gold" : "bg-cream/10"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-7">
          {step === 1 && <StepDate date={date} onSelect={handleDateSelect} />}
          {step === 2 && <StepPlayers players={players} onSelect={handlePlayersSelect} />}
          {step === 3 && (
            <StepTimes
              date={date}
              players={players}
              teeTimes={teeTimes}
              selectedTeeTime={slot}
              loading={teeTimesLoading}
              error={teeTimesError}
              bookingError={bookingError}
              onRetry={() => void fetchTeeTimes(date)}
              onSelect={(selectedSlot) => {
                setSlot(selectedSlot);
                setBookingError(null);
              }}
            />
          )}
          {step === 4 && slot && (
            <StepDetails
              form={form}
              setForm={setForm}
              playerBreakdown={playerBreakdown}
              setPlayerBreakdown={setPlayerBreakdown}
              players={players}
              date={date}
              slot={slot}
              bookingError={bookingError}
            />
          )}
          {step === 5 && slot && (
            <StepConfirm
              date={date}
              players={players}
              slot={slot}
              firstName={form.name.trim().split(" ")[0]}
              confirmationCode={confirmationCode}
              onClose={close}
            />
          )}
        </div>

        {step < 5 && (
          <div className="flex-none px-4 sm:px-6 py-4 sm:py-5 border-t border-cream/10">
            <button
              onClick={advance}
              disabled={!isStepValid}
              className={`w-full py-4 text-sm font-bold uppercase tracking-widest rounded transition-all duration-200 ${
                isStepValid
                  ? "bg-gold text-night hover:bg-gold-light cursor-pointer"
                  : "bg-cream/10 text-cream/25 cursor-not-allowed"
              }`}
            >
              {ctaLabel}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
