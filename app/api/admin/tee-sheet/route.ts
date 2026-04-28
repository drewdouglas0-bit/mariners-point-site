import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdminSessionFromRequest, unauthorizedResponse } from "@/lib/admin/auth";

export async function GET(request: Request) {
  if (!(await requireAdminSessionFromRequest(request))) {
    return unauthorizedResponse();
  }

  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("tee_times")
    .select(
      "id,date,start_time,status,blocked_reason,blocked_by,bookings(id,confirmation_code,status,player_count,notes,player_breakdown,golfers(id,name,email,phone))",
    )
    .eq("date", date)
    .order("start_time", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Unable to load tee sheet." }, { status: 500 });
  }

  const slots = (data ?? []).map((slot: Record<string, unknown>) => {
    const bookingList = Array.isArray(slot.bookings) ? slot.bookings : [];
    const booking = (bookingList[0] as Record<string, unknown> | undefined) ?? null;
    const golfer = (booking?.golfers as Record<string, unknown> | undefined) ?? null;

    return {
      id: String(slot.id),
      date: String(slot.date),
      start_time: String(slot.start_time),
      status: String(slot.status),
      blocked_reason: slot.blocked_reason ? String(slot.blocked_reason) : null,
      blocked_by: slot.blocked_by ? String(slot.blocked_by) : null,
      booking: booking
        ? {
            id: String(booking.id),
            confirmation_code: String(booking.confirmation_code),
            status: String(booking.status),
            player_count: Number(booking.player_count),
            notes: booking.notes ? String(booking.notes) : null,
            player_breakdown: (booking.player_breakdown as Record<string, number>) ?? {},
            golfer: golfer
              ? {
                  id: String(golfer.id),
                  name: String(golfer.name),
                  email: String(golfer.email),
                  phone: String(golfer.phone),
                }
              : null,
          }
        : null,
    };
  });

  return NextResponse.json({ date, slots });
}
