import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdminSessionFromRequest, unauthorizedResponse } from "@/lib/admin/auth";

export async function GET(request: Request) {
  if (!(await requireAdminSessionFromRequest(request))) {
    return unauthorizedResponse();
  }

  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim();

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const supabase = createServiceRoleClient();

  const { data: golfers, error: golferError } = await supabase
    .from("golfers")
    .select("id")
    .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(50);

  if (golferError) {
    return NextResponse.json({ error: "Unable to search bookings." }, { status: 500 });
  }

  const golferIds = (golfers ?? []).map((golfer) => golfer.id);

  let bookingQuery = supabase
    .from("bookings")
    .select(
      "id,confirmation_code,status,player_count,player_breakdown,total_price,estimated_adjustment,notes,cancelled_at,cancellation_reason,created_at,updated_at,tee_times(id,date,start_time,status,blocked_reason),golfers(id,name,email,phone,no_show_count,is_flagged,flagged_reason,last_booking_at)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (golferIds.length > 0) {
    const escaped = query.replace(/,/g, "");
    bookingQuery = bookingQuery.or(
      `confirmation_code.ilike.%${escaped}%,golfer_id.in.(${golferIds.join(",")})`,
    );
  } else {
    bookingQuery = bookingQuery.ilike("confirmation_code", `%${query.toUpperCase()}%`);
  }

  const { data: bookings, error: bookingError } = await bookingQuery;

  if (bookingError) {
    return NextResponse.json({ error: "Unable to search bookings." }, { status: 500 });
  }

  return NextResponse.json({ results: bookings ?? [] });
}
