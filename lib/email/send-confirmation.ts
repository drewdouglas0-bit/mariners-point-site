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
  console.log('📧 sendBookingConfirmation started')

  const apiKey = process.env.RESEND_API_KEY
  console.log('📧 API key exists:', !!apiKey, 'starts with re_:', apiKey?.startsWith('re_'))

  if (!apiKey) {
    console.error('📧 No API key found')
    return { success: false, error: 'No API key' }
  }

  try {
    const resend = new Resend(apiKey)
    console.log('📧 Resend client created, sending to:', to)

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [to],
      subject: `Booking Confirmed — ${confirmationCode}`,
      text: `Hi ${name}, your booking is confirmed. Confirmation code: ${confirmationCode}`,
    })

    console.log('📧 Resend response:', JSON.stringify(result))
    return { success: true, data: result }
  } catch (err) {
    console.error('📧 Resend threw exception:', err)
    return { success: false, error: String(err) }
  }
}
