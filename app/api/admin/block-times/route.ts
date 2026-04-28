import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdminSessionFromRequest, unauthorizedResponse } from "@/lib/admin/auth";

function toISODateTime(date: string, time: string) {
  return `${date}T${time}:00`;
}

export async function GET(request: Request) {
  if (!(await requireAdminSessionFromRequest(request))) {
    return unauthorizedResponse();
  }

  const supabase = createServiceRoleClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("blocked_times")
    .select("id,start_datetime,end_datetime,reason,blocked_by,created_at")
    .gte("end_datetime", now)
    .order("start_datetime", { ascending: true })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: "Unable to load blocked times." }, { status: 500 });
  }

  return NextResponse.json({ blocks: data ?? [] });
}

export async function POST(request: Request) {
  if (!(await requireAdminSessionFromRequest(request))) {
    return unauthorizedResponse();
  }

  const body = (await request.json()) as {
    date?: string;
    start_time?: string;
    end_time?: string;
    reason?: string;
  };

  const date = body.date?.trim();
  const startTime = body.start_time?.trim();
  const endTime = body.end_time?.trim();
  const reason = body.reason?.trim();

  if (!date || !startTime || !endTime || !reason) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (startTime > endTime) {
    return NextResponse.json({ error: "End time must be after start time." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: slots, error: slotError } = await supabase
    .from("tee_times")
    .select("id")
    .eq("date", date)
    .gte("start_time", startTime)
    .lte("start_time", endTime)
    .eq("status", "available");

  if (slotError) {
    return NextResponse.json({ error: "Unable to load tee times." }, { status: 500 });
  }

  const slotIds = (slots ?? []).map((slot) => slot.id);
  if (slotIds.length === 0) {
    return NextResponse.json({ error: "No available slots in that range." }, { status: 409 });
  }

  const { error: updateError } = await supabase
    .from("tee_times")
    .update({ status: "blocked", blocked_reason: reason, blocked_by: "Pro Shop Staff" })
    .in("id", slotIds)
    .eq("status", "available");

  if (updateError) {
    return NextResponse.json({ error: "Unable to block slots." }, { status: 500 });
  }

  const { data: block, error: blockError } = await supabase
    .from("blocked_times")
    .insert({
      start_datetime: toISODateTime(date, startTime),
      end_datetime: toISODateTime(date, endTime),
      reason,
      blocked_by: "Pro Shop Staff",
    })
    .select("id,start_datetime,end_datetime,reason,blocked_by,created_at")
    .single();

  if (blockError) {
    return NextResponse.json({ error: "Slots blocked but block record failed." }, { status: 500 });
  }

  return NextResponse.json({ success: true, block, blocked_count: slotIds.length });
}
