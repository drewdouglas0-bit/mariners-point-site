import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdminSessionFromRequest, unauthorizedResponse } from "@/lib/admin/auth";

const NO_SHOW_FLAG_THRESHOLD = 3;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdminSessionFromRequest(request))) {
    return unauthorizedResponse();
  }

  const { id } = await params;
  const supabase = createServiceRoleClient();

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("id,golfer_id,status")
    .eq("id", id)
    .maybeSingle();

  if (bookingError || !booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const { error: bookingUpdateError } = await supabase
    .from("bookings")
    .update({ status: "no_show", updated_at: now })
    .eq("id", id);

  if (bookingUpdateError) {
    return NextResponse.json({ error: "Unable to mark no-show." }, { status: 500 });
  }

  const { data: golfer, error: golferError } = await supabase
    .from("golfers")
    .select("id,no_show_count")
    .eq("id", booking.golfer_id)
    .maybeSingle();

  if (golferError || !golfer) {
    return NextResponse.json({ error: "Unable to update golfer record." }, { status: 500 });
  }

  const nextNoShowCount = (golfer.no_show_count ?? 0) + 1;
  const shouldFlag = nextNoShowCount >= NO_SHOW_FLAG_THRESHOLD;

  const { error: golferUpdateError } = await supabase
    .from("golfers")
    .update({
      no_show_count: nextNoShowCount,
      is_flagged: shouldFlag,
      flagged_reason: shouldFlag
        ? `Auto-flagged after ${nextNoShowCount} no-shows.`
        : null,
    })
    .eq("id", golfer.id);

  if (golferUpdateError) {
    return NextResponse.json({ error: "Unable to update golfer record." }, { status: 500 });
  }

  return NextResponse.json({ success: true, no_show_count: nextNoShowCount, is_flagged: shouldFlag });
}
