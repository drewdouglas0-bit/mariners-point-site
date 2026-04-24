import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  let supabase_reachable = false
  let supabase_error = null
  let supabase_row_count = 0

  try {
    const res = await fetch(
      `${url}/rest/v1/tee_times?date=eq.2026-04-24&status=eq.available&select=id&limit=5`,
      {
        headers: {
          'apikey': anonKey!,
          'Authorization': `Bearer ${anonKey!}`,
        }
      }
    )
    const json = await res.json()
    supabase_reachable = res.ok
    supabase_row_count = Array.isArray(json) ? json.length : 0
    if (!res.ok) supabase_error = JSON.stringify(json)
  } catch (e) {
    supabase_error = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json({
    url_exists: !!url,
    url_prefix: url?.substring(0, 30),
    anon_key_exists: !!anonKey,
    anon_key_prefix: anonKey?.substring(0, 20),
    anon_key_length: anonKey?.length,
    service_key_exists: !!serviceKey,
    service_key_prefix: serviceKey?.substring(0, 20),
    service_key_length: serviceKey?.length,
    supabase_reachable,
    supabase_error,
    supabase_row_count,
  })
}
