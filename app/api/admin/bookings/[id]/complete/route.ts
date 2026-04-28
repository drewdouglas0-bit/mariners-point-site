import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdminSessionFromRequest, unauthorizedResponse } from "@/lib/admin/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdminSessionFromRequest(request))) {
    return unauthorizedResponse();
  }

  const { id } = await params;
  const supabase = createServiceRoleClient();

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "completed", updated_at: now })
    .eq("id", id)
    .select("id,status,updated_at")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Unable to mark booking complete." }, { status: 500 });
  }

  return NextResponse.json({ booking: data });
}
