import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdminSessionFromRequest, unauthorizedResponse } from "@/lib/admin/auth";

export async function POST(request: Request) {
  if (!(await requireAdminSessionFromRequest(request))) {
    return unauthorizedResponse();
  }

  const body = (await request.json()) as { block_id?: string };
  const blockId = body.block_id?.trim();

  if (!blockId) {
    return NextResponse.json({ error: "block_id is required." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: block, error: blockError } = await supabase
    .from("blocked_times")
    .select("id,start_datetime,end_datetime,reason")
    .eq("id", blockId)
    .maybeSingle();

  if (blockError || !block) {
    return NextResponse.json({ error: "Blocked range not found." }, { status: 404 });
  }

  const start = new Date(block.start_datetime);
  const end = new Date(block.end_datetime);

  const date = start.toISOString().slice(0, 10);
  const startTime = start.toISOString().slice(11, 19);
  const endTime = end.toISOString().slice(11, 19);

  const { error: updateError } = await supabase
    .from("tee_times")
    .update({ status: "available", blocked_reason: null, blocked_by: null })
    .eq("date", date)
    .gte("start_time", startTime)
    .lte("start_time", endTime)
    .eq("status", "blocked")
    .eq("blocked_reason", block.reason);

  if (updateError) {
    return NextResponse.json({ error: "Unable to unblock slots." }, { status: 500 });
  }

  const { error: deleteError } = await supabase.from("blocked_times").delete().eq("id", block.id);

  if (deleteError) {
    return NextResponse.json({ error: "Slots unblocked but cleanup failed." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
