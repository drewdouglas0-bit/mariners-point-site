"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function CancelBookingPage() {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmation_code: confirmationCode.trim().toUpperCase(),
          reason: reason.trim() || undefined,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(payload?.error || "Something went wrong, please try again.");
        return;
      }

      setSuccessMessage(
        payload?.message ||
          "Your booking has been cancelled. The tee time is now available for other golfers.",
      );
      setConfirmationCode("");
      setReason("");
    } catch {
      setErrorMessage("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-night text-cream">
      <section className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-cream/60 hover:text-gold transition-colors mb-8"
        >
          ← Back to home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Cancel a booking</h1>
        <p className="text-cream/55 mb-10">
          Enter your confirmation code to cancel your booking and release the tee time.
        </p>

        <form
          onSubmit={handleSubmit}
          className="border border-cream/10 bg-navy/40 p-6 sm:p-8 space-y-6"
        >
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-cream/40 mb-2">
              Confirmation code
            </label>
            <input
              type="text"
              placeholder="MP-4821"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
              className="w-full bg-cream/5 border border-cream/15 rounded px-4 py-3 text-sm text-cream placeholder:text-cream/25 focus:outline-none focus:border-gold/50"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-cream/40 mb-2">
              Reason for cancelling (optional)
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Optional note"
              className="w-full bg-cream/5 border border-cream/15 rounded px-4 py-3 text-sm text-cream placeholder:text-cream/25 focus:outline-none focus:border-gold/50"
            />
          </div>

          {successMessage && (
            <p className="text-sm text-green-300 border border-green-300/30 bg-green-500/5 rounded p-3">
              {successMessage}
            </p>
          )}

          {errorMessage && (
            <p className="text-sm text-red-200 border border-red-400/30 bg-red-500/5 rounded p-3">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full min-h-[44px] text-sm font-bold uppercase tracking-widest transition-colors ${
              loading
                ? "bg-cream/10 text-cream/25 cursor-not-allowed"
                : "bg-gold text-night hover:bg-gold-light"
            }`}
          >
            {loading ? "Cancelling..." : "Cancel my booking"}
          </button>
        </form>
      </section>
    </main>
  );
}
