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
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.error('No API key found')
    return { success: false, error: 'No API key' }
  }

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
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

------------------------
Date:     ${formattedDate}
Time:     ${formattedTime}
Players:  ${playerCount}
Est. Total: $${totalPrice.toFixed(2)}
------------------------

Final rate adjustments are made at the pro shop upon arrival. Please bring valid ID or proof of eligibility for discounted rates.

GETTING THERE
Mariners Point Golf Center
2401 E 3rd Ave, Foster City, CA 94404

Open until 10 PM seven nights a week.

NEED TO CANCEL?
Visit ${process.env.NEXT_PUBLIC_SITE_URL}/cancel
Enter your confirmation code: ${confirmationCode}

Questions? Call (650) 573-7888.

See you on the course,
Mariners Point Golf Center`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: [to],
          subject: `Booking Confirmed — ${confirmationCode} — ${formattedDate} at ${formattedTime}`,
          text: body,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      const responseText = await response.text()
      if (!response.ok) {
        console.error('Resend API error:', response.status, responseText)
      }

      return { success: response.ok, data: responseText }
    } catch (fetchErr) {
      clearTimeout(timeout)
      console.error('Fetch to Resend failed:', fetchErr)
      return { success: false, error: String(fetchErr) }
    }
  } catch (err) {
    console.error('Resend threw exception:', err)
    return { success: false, error: String(err) }
  }
}

export async function sendCancellationConfirmation({
  to,
  name,
  confirmationCode,
  date,
  startTime,
  playerCount,
}: {
  to: string
  name: string
  confirmationCode: string
  date: string
  startTime: string
  playerCount: number
}) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.error('No RESEND_API_KEY found — cancellation email not sent')
    return { success: false, error: 'No API key' }
  }

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

Your booking at Mariners Point Golf Center has been cancelled.

CANCELLED BOOKING
------------------------
Confirmation Code: ${confirmationCode}
Date:     ${formattedDate}
Time:     ${formattedTime}
Players:  ${playerCount}
------------------------

This tee time is now available for other golfers.

If you cancelled by mistake or have questions, please call us at (650) 573-7888 and we'll do our best to help.

We hope to see you on the course soon.

Mariners Point Golf Center
2401 E 3rd Ave, Foster City, CA 94404
marinerspoint.com`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [to],
        subject: `Booking Cancelled — ${confirmationCode} — ${formattedDate} at ${formattedTime}`,
        text: body,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    const responseText = await response.text()
    if (!response.ok) {
      console.error('Resend cancellation email error:', response.status, responseText)
    }

    return { success: response.ok, data: responseText }
  } catch (err) {
    console.error('Cancellation email fetch failed:', err)
    return { success: false, error: String(err) }
  }
}
