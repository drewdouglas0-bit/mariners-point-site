import { Resend } from 'resend'

export async function sendBookingConfirmation({
  to,
  name,
  confirmationCode,
  date,
  startTime,
  playerCount,
  totalPrice,
}: {
  to: string
  name: string
  confirmationCode: string
  date: string
  startTime: string
  playerCount: number
  totalPrice: number
}) {
  console.log('📧 sendBookingConfirmation called for:', to, confirmationCode)

  const apiKey = process.env.RESEND_API_KEY
  console.log('📧 RESEND_API_KEY exists:', !!apiKey, 'length:', apiKey?.length)

  if (!apiKey) {
    console.error('📧 RESEND_API_KEY is missing — email not sent')
    return { success: false, error: 'Missing API key' }
  }

  const resend = new Resend(apiKey)

  const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const formattedTime = new Date(`2000-01-01T${startTime}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const body = `Hi ${name},

You're booked at Mariners Point Golf Center.

CONFIRMATION CODE: ${confirmationCode}

────────────────────────
Date:     ${formattedDate}
Time:     ${formattedTime}
Players:  ${playerCount}
Est. Total: $${totalPrice.toFixed(2)}
────────────────────────

Final rate adjustments are made at the pro shop upon arrival.

GETTING THERE
Mariners Point Golf Center
2401 E 3rd Ave, Foster City, CA 94404

Open until 10 PM seven nights a week.

NEED TO CANCEL?
Visit ${process.env.NEXT_PUBLIC_SITE_URL}/cancel and enter your confirmation code: ${confirmationCode}

Questions? Call (650) 573-7888.

See you on the course,
Mariners Point Golf Center`

  console.log('📧 Attempting to send email via Resend...')

  try {
    const { data, error } = await resend.emails.send({
      from: 'Mariners Point <onboarding@resend.dev>',
      to,
      subject: `Booking Confirmed — ${confirmationCode} — ${formattedDate} at ${formattedTime}`,
      text: body,
    })

    if (error) {
      console.error('📧 Resend returned error:', JSON.stringify(error))
      return { success: false, error }
    }

    console.log('📧 Email sent successfully:', data)
    return { success: true, data }
  } catch (err) {
    console.error('📧 Exception calling Resend:', err)
    return { success: false, error: err }
  }
}
