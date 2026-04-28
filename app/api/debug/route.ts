import { NextResponse } from "next/server";

export async function GET() {
  const resendKey = process.env.RESEND_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return NextResponse.json({
    resend_key_exists: !!resendKey,
    resend_key_prefix: resendKey?.substring(0, 10),
    resend_key_length: resendKey?.length,
    supabase_url_exists: !!supabaseUrl,
    site_url_exists: !!siteUrl,
    site_url: siteUrl,
  });
}
