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
  console.log('📧 sendBookingConfirmation started')

  const apiKey = process.env.RESEND_API_KEY
  console.log('📧 API key exists:', !!apiKey, 'starts with re_:', apiKey?.startsWith('re_'))

  if (!apiKey) {
    console.error('📧 No API key found')
    return { success: false, error: 'No API key' }
  }

  try {
    console.log('📧 Calling Resend API directly via fetch...')

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
          subject: `Booking Confirmed — ${confirmationCode}`,
          text: `Hi ${name}, your booking is confirmed. Code: ${confirmationCode}`,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      const responseText = await response.text()
      console.log('📧 Resend HTTP status:', response.status)
      console.log('📧 Resend response body:', responseText)

      return { success: response.ok, data: responseText }
    } catch (fetchErr) {
      clearTimeout(timeout)
      console.error('📧 Fetch to Resend failed:', fetchErr)
      return { success: false, error: String(fetchErr) }
    }
  } catch (err) {
    console.error('📧 Resend threw exception:', err)
    return { success: false, error: String(err) }
  }
}
