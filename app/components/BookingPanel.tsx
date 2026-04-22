"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Players = 1 | 2 | 3 | 4;
type Step = 1 | 2 | 3 | 4 | 5;

interface TeeSlot {
  time: string;
  label: string;
  price: number; // per player
  booked: boolean;
}

// ─── Pure helpers (no React) ──────────────────────────────────────────────────

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Deterministic pseudo-random — same date always produces the same availability.
function seededRandom(dateKey: string, index: number): number {
  let h = 0;
  const s = dateKey + index;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  }
  return (h >>> 0) / 0xffffffff;
}

function minsToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(min).padStart(2, "0")} ${ampm}`;
}

function slotLabel(m: number): string {
  if (m < 12 * 60) return "Morning";
  if (m < 17 * 60) return "Afternoon";
  if (m < 19 * 60) return "Twilight";
  return "Under the Lights";
}

function slotPrice(m: number, isWeekend: boolean): number {
  if (m >= 19 * 60) return 13;
  if (m >= 17 * 60) return 15;
  if (isWeekend) return m < 12 * 60 ? 26 : 22;
  return m < 12 * 60 ? 20 : 18;
}

function buildSlots(date: Date): TeeSlot[] {
  const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const out: TeeSlot[] = [];
  // 7:30 AM (450 min) to 8:30 PM (1230 min), 15-min intervals = 53 slots
  for (let m = 450, i = 0; m <= 1230; m += 15, i++) {
    out.push({
      time: minsToTime(m),
      label: slotLabel(m),
      price: slotPrice(m, isWeekend),
      booked: seededRandom(key, i) < 0.25,
    });
  }
  return out;
}

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

// ─── Step 1 — Date ───────────────────────────────────────────────────────────

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
              {/* Dot marks today when not selected */}
              {i === 0 && !sel && <span className="w-1 h-1 rounded-full bg-gold mt-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2 — Players ─────────────────────────────────────────────────────────

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

// ─── Step 3 — Tee Times ───────────────────────────────────────────────────────

function StepTimes({
  date, players, slot, onSelect,
}: {
  date: Date;
  players: Players;
  slot: TeeSlot | null;
  onSelect: (s: TeeSlot) => void;
}) {
  const slots = buildSlots(date);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1 text-cream">Choose a time</h2>
      <p className="text-cream/45 text-sm mb-5">
        {longDate(date)} · {players} {players === 1 ? "player" : "players"}
      </p>

      <div>
        {slots.map((s, i) => {
          const newGroup = i === 0 || s.label !== slots[i - 1].label;
          const sel = slot?.time === s.time;

          return (
            <div key={i}>
              {newGroup && (
                <p className="text-[10px] tracking-[0.2em] uppercase text-cream/30 pt-5 pb-2">
                  {s.label}
                </p>
              )}
              <button
                disabled={s.booked}
                onClick={() => onSelect(s)}
                className={`w-full min-h-[44px] flex items-center justify-between px-4 py-3.5 rounded-sm text-left transition-all duration-100 border-l-2 ${
                  s.booked
                    ? "opacity-30 cursor-not-allowed border-transparent"
                    : sel
                    ? "bg-gold/10 border-gold"
                    : "hover:bg-cream/5 border-transparent"
                }`}
              >
                <span className={`text-sm font-medium ${sel ? "text-gold" : "text-cream"}`}>
                  {s.time}
                </span>
                {s.booked ? (
                  <span className="text-xs text-cream/30">Booked</span>
                ) : (
                  <span className={`text-sm font-semibold ${sel ? "text-gold" : "text-cream/80"}`}>
                    ${s.price * players}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 4 — Details ────────────────────────────────────────────────────────

function StepDetails({
  form, setForm, date, players, slot,
}: {
  form: { name: string; email: string; phone: string };
  setForm: (f: { name: string; email: string; phone: string }) => void;
  date: Date;
  players: Players;
  slot: TeeSlot;
}) {
  const fields = [
    { key: "name" as const, label: "Full Name", type: "text", placeholder: "Jane Smith" },
    { key: "email" as const, label: "Email Address", type: "email", placeholder: "jane@example.com" },
    { key: "phone" as const, label: "Phone Number", type: "tel", placeholder: "(415) 000-0000" },
  ];

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-xl font-semibold mb-1 text-cream">Your details</h2>
        <p className="text-cream/45 text-sm">Who&apos;s booking this round?</p>
      </div>

      <div className="space-y-5">
        {fields.map(({ key, label, type, placeholder }) => (
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
      </div>

      {/* Booking summary */}
      <div className="border border-cream/10 rounded p-5">
        <p className="text-[10px] uppercase tracking-widest text-cream/35 mb-4">Booking Summary</p>
        <div className="space-y-3">
          {[
            { label: "Date", value: longDate(date) },
            { label: "Time", value: slot.time },
            { label: "Players", value: String(players) },
            { label: "Rate", value: `$${slot.price} / player` },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-cream/50">{row.label}</span>
              <span className="text-cream font-medium">{row.value}</span>
            </div>
          ))}
          <div className="border-t border-cream/10 pt-3 flex justify-between">
            <span className="text-cream font-semibold text-sm">Total</span>
            <span className="font-bold text-gold">${slot.price * players}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 5 — Confirmation ───────────────────────────────────────────────────

function StepConfirm({
  date, players, slot, firstName, onClose,
}: {
  date: Date;
  players: Players;
  slot: TeeSlot;
  firstName: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center pt-4">
      {/* Checkmark ring */}
      <div className="w-16 h-16 rounded-full border border-gold/50 flex items-center justify-center mb-6">
        <svg
          width="22" height="22" viewBox="0 0 22 22" fill="none"
          stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          className="text-gold"
        >
          <polyline points="19 5 8 16 3 11" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-cream">You&apos;re booked.</h2>
      <p className="text-cream/45 text-sm mb-8">
        {firstName
          ? `See you on the course, ${firstName}.`
          : "See you on the course."}
      </p>

      {/* Recap */}
      <div className="w-full border border-cream/10 rounded p-5 text-left space-y-3 mb-5">
        {[
          { label: "Date", value: longDate(date) },
          { label: "Time", value: slot.time },
          { label: "Players", value: String(players) },
        ].map((row) => (
          <div key={row.label} className="flex justify-between text-sm">
            <span className="text-cream/50">{row.label}</span>
            <span className="text-cream font-medium">{row.value}</span>
          </div>
        ))}
        <div className="border-t border-cream/10 pt-3 flex justify-between text-sm">
          <span className="text-cream/50">Total</span>
          <span className="font-bold text-gold">${slot.price * players}</span>
        </div>
      </div>

      {/* Demo disclaimer */}
      <div className="w-full border border-cream/10 rounded p-4 mb-8">
        <p className="text-cream/30 text-xs leading-relaxed">
          This is a design demo — no real reservation has been made. For actual
          bookings, call Mariners Point at{" "}
          <a href="tel:6505737888" className="text-cream/50 hover:text-gold transition-colors">
            (650) 573-7888
          </a>.
        </p>
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

// ─── BookingPanel ─────────────────────────────────────────────────────────────

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
  const [slot, setSlot] = useState<TeeSlot | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Reset all state after the close animation completes
  const reset = useCallback(() => {
    setTimeout(() => {
      setStep(1);
      setDate(getToday());
      setPlayers(2);
      setSlot(null);
      setForm({ name: "", email: "", phone: "" });
    }, 300);
  }, []);

  const close = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  const handleDateSelect = (d: Date) => {
    setDate(d);
    setSlot(null); // Slot availability can differ by date, so reset
  };

  // Step is valid when the user can advance
  const isStepValid =
    step === 3 ? slot !== null :
    step === 4 ? form.name.trim().length > 0 && form.email.includes("@") && form.phone.trim().length >= 7 :
    true;

  const advance = () => {
    if (step === 5) { close(); return; }
    setStep((s) => (s + 1) as Step);
  };

  const ctaLabel =
    step === 4 ? "Confirm Booking" :
    step === 5 ? "Done" :
    "Continue";

  const showBack = step > 1 && step < 5;

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 bg-black/60 z-[70] sm:z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Slide panel ──────────────────────────────────────────────── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Book a tee time"
        className={`fixed right-0 top-0 h-full w-full md:max-w-[480px] bg-navy z-[80] sm:z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Panel header ──────────────────────────────────────────── */}
        <div className="flex-none px-4 sm:px-6 pt-[max(16px,env(safe-area-inset-top))] sm:pt-5 pb-4 border-b border-cream/10">
          <div className="flex items-center justify-between mb-4">
            {/* Back */}
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className={`text-xs text-cream/50 hover:text-cream transition-colors min-h-[44px] pr-4 ${
                showBack ? "" : "invisible pointer-events-none"
              }`}
            >
              ← Back
            </button>

            {/* Step counter */}
            {step < 5 && (
              <span className="text-[10px] tracking-[0.2em] uppercase text-cream/30">
                Step {step} of 4
              </span>
            )}

            {/* Close */}
            <button
              onClick={close}
              aria-label="Close booking panel"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-cream/50 hover:text-cream transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="1" y1="1" x2="13" y2="13" />
                <line x1="13" y1="1" x2="1" y2="13" />
              </svg>
            </button>
          </div>

          {/* Progress bar — 4 segments (step 5 is confirmation, no bar needed) */}
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

        {/* ── Scrollable step content ───────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-7">
          {step === 1 && (
            <StepDate date={date} onSelect={handleDateSelect} />
          )}
          {step === 2 && (
            <StepPlayers players={players} onSelect={setPlayers} />
          )}
          {step === 3 && (
            <StepTimes date={date} players={players} slot={slot} onSelect={setSlot} />
          )}
          {step === 4 && slot && (
            <StepDetails form={form} setForm={setForm} date={date} players={players} slot={slot} />
          )}
          {step === 5 && slot && (
            <StepConfirm
              date={date}
              players={players}
              slot={slot}
              firstName={form.name.trim().split(" ")[0]}
              onClose={close}
            />
          )}
        </div>

        {/* ── Footer CTA ───────────────────────────────────────────── */}
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
