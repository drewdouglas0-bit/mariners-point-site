import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('tee_times')
      .select('id, date, start_time, price_per_player, status, max_players')
      .eq('date', date)
      .eq('status', 'available')
      .order('start_time', { ascending: true })

    if (error) {
      return NextResponse.json({
        error: 'Unable to load tee times right now.',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    return NextResponse.json(data)

  } catch (err) {
    return NextResponse.json({
      error: 'Unable to load tee times right now.',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 })
  }
}
