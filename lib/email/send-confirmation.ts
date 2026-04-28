import { Resend } from "resend";

export async function sendBookingConfirmation({
  to,
  name,
  confirmationCode,
  date,
  startTime,
  playerCount,
  totalPrice,
}: {
  to: string;
  name: string;
  confirmationCode: string;
  date: string;
  startTime: string;
  playerCount: number;
  totalPrice: number;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not set.");
  }
  const resend = new Resend(resendApiKey);

  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const formattedTime = new Date(`2000-01-01T${startTime}`).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const body = `Hi ${name},

You're booked at Mariners Point Golf Center.

CONFIRMATION CODE: ${confirmationCode}

------------------------
Date:       ${formattedDate}
Time:       ${formattedTime}
Players:    ${playerCount}
Est. Total: $${totalPrice.toFixed(2)}
------------------------

Final rate adjustments (senior, junior, resident, replay, frequent play card) are made at the pro shop upon arrival. Please bring valid ID or proof of eligibility if booking a discounted rate.

GETTING THERE
Mariners Point Golf Center
2401 E 3rd Ave, Foster City, CA 94404

We're open until 10 PM seven nights a week - lighted for night play on the San Francisco Bay.

NEED TO CANCEL?
Visit ${siteUrl}/cancel and enter your confirmation code: ${confirmationCode}
Cancellations must be made online. No-shows are tracked and may affect future booking eligibility.

Questions? Call us at (650) 573-7888.

See you on the course,
Mariners Point Golf Center
marinerspoint.com`;

  const { data, error } = await resend.emails.send({
    from: 'Mariners Point <onboarding@resend.dev>',
    to,
    subject: `Booking Confirmed - ${confirmationCode} - ${formattedDate} at ${formattedTime}`,
    text: body,
  });

  if (error) {
    console.error("Failed to send confirmation email:", error);
    return { success: false, error };
  }

  return { success: true, data };
}
