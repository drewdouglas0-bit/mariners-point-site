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
  const body = (await request.json().catch(() => ({}))) as { reason?: string };
  const reason = body.reason?.trim() || null;

  const supabase = createServiceRoleClient();

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("id,tee_time_id,status")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const { error: updateBookingError } = await supabase
    .from("bookings")
    .update({
      status: "cancelled",
      cancelled_at: now,
      cancellation_reason: reason,
      updated_at: now,
    })
    .eq("id", booking.id);

  if (updateBookingError) {
    return NextResponse.json({ error: "Unable to cancel booking." }, { status: 500 });
  }

  const { error: updateTeeTimeError } = await supabase
    .from("tee_times")
    .update({ status: "available" })
    .eq("id", booking.tee_time_id)
    .eq("status", "booked");

  if (updateTeeTimeError) {
    return NextResponse.json({ error: "Unable to free tee time." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
