import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const ONLINE_RATE = 23;
const SLOT_INTERVAL_MINUTES = 10;
const DAYS_TO_GENERATE = 15; // today through 14 days from now (inclusive)

function toDateOnlyString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toTimeStringFromMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

export async function POST() {
  try {
    const supabase = createServiceRoleClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const teeTimesToInsert: Array<{
      date: string;
      start_time: string;
      price_per_player: number;
      status: "available";
    }> = [];

    for (let dayOffset = 0; dayOffset < DAYS_TO_GENERATE; dayOffset++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + dayOffset);

      const dayOfWeek = targetDate.getDay();
      const startMinutes = dayOfWeek === 1 ? 10 * 60 : 7 * 60 + 30;
      const endMinutes = 20 * 60 + 30;

      for (
        let minuteCursor = startMinutes;
        minuteCursor <= endMinutes;
        minuteCursor += SLOT_INTERVAL_MINUTES
      ) {
        teeTimesToInsert.push({
          date: toDateOnlyString(targetDate),
          start_time: toTimeStringFromMinutes(minuteCursor),
          price_per_player: ONLINE_RATE,
          status: "available",
        });
      }
    }

    const { data, error } = await supabase
      .from("tee_times")
      .upsert(teeTimesToInsert, {
        onConflict: "date,start_time",
        ignoreDuplicates: true,
      })
      .select("id");

    if (error) {
      console.error("Failed to upsert tee times", error);
      return NextResponse.json(
        {
          error: "Unable to generate tee times right now.",
          created: 0,
          attempted: teeTimesToInsert.length,
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      );
    }

    return Response.json({
      created: data?.length ?? 0,
      attempted: teeTimesToInsert.length,
      message: "Tee times generated successfully.",
    });
  } catch (error) {
    console.error("Unexpected tee time generation error", error);
    return Response.json(
      { error: "Unable to generate tee times right now." },
      { status: 500 },
    );
  }
}
