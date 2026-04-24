import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

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
    const { data, error } = await supabase
      .from("tee_times")
      .select("id,date,start_time,max_players,price_per_player,status")
      .eq("date", date)
      .eq("status", "available")
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Failed to fetch available tee times", error);
      return Response.json(
        {
          error: "Unable to load tee times right now.",
          debug: { message: error.message, code: error.code, details: error.details, hint: error.hint },
        },
        { status: 500 },
      );
    }

    return Response.json(data ?? []);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("Unexpected tee time fetch error", err);
    return Response.json(
      { error: "Unable to load tee times right now.", debug: { message, stack } },
      { status: 500 },
    );
  }
}
