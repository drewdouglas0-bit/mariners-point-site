import { createSupabaseServerClient } from "@/lib/supabase/server";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date || !DATE_PATTERN.test(date)) {
      return Response.json(
        { error: "A valid date query parameter is required (YYYY-MM-DD)." },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("tee_times")
      .select("id,date,start_time,max_players,price_per_player,status")
      .eq("date", date)
      .eq("status", "available")
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Failed to fetch available tee times", error);
      return Response.json(
        { error: "Unable to load tee times right now." },
        { status: 500 },
      );
    }

    return Response.json(data ?? []);
  } catch (error) {
    console.error("Unexpected tee time fetch error", error);
    return Response.json(
      { error: "Unable to load tee times right now." },
      { status: 500 },
    );
  }
}
