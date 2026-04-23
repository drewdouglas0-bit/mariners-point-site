import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  return NextResponse.json({
    url_exists: !!url,
    url_prefix: url?.substring(0, 30),
    anon_key_exists: !!anonKey,
    anon_key_prefix: anonKey?.substring(0, 20),
    anon_key_length: anonKey?.length,
    service_key_exists: !!serviceKey,
    service_key_prefix: serviceKey?.substring(0, 20),
    service_key_length: serviceKey?.length,
  })
}
