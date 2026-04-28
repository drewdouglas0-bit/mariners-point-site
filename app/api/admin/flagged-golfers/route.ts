import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdminSessionFromRequest, unauthorizedResponse } from "@/lib/admin/auth";

export async function GET(request: Request) {
  if (!(await requireAdminSessionFromRequest(request))) {
    return unauthorizedResponse();
  }

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("golfers")
    .select("id,name,email,phone,no_show_count,is_flagged,flagged_reason,last_booking_at")
    .eq("is_flagged", true)
    .order("no_show_count", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Unable to load flagged golfers." }, { status: 500 });
  }

  return NextResponse.json({ golfers: data ?? [] });
}
