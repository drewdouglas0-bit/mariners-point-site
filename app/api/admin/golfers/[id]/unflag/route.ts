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
  const body = (await request.json().catch(() => ({}))) as { note?: string };
  const note = body.note?.trim();

  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from("golfers")
    .update({
      is_flagged: false,
      no_show_count: 0,
      flagged_reason: note || null,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Unable to unflag golfer." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
