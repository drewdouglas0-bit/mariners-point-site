import { createServiceRoleClient } from "@/lib/supabase/server";
import type {
  CreateBookingRequest,
  CreateBookingResponse,
  PlayerBreakdown,
} from "@/lib/types/booking";

const ONLINE_RATE = 23;

function sumBreakdown(breakdown: PlayerBreakdown): number {
  return (
    breakdown.standard +
    breakdown.senior +
    breakdown.junior +
    breakdown.resident +
    breakdown.replay +
    breakdown.frequent_play
  );
}

function isValidBreakdownValue(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    Number.isFinite(value) &&
    value >= 0
  );
}

function hasValidBreakdownShape(
  breakdown: unknown,
): breakdown is PlayerBreakdown {
  if (!breakdown || typeof breakdown !== "object") {
    return false;
  }

  const typed = breakdown as Record<string, unknown>;
  return (
    isValidBreakdownValue(typed.standard) &&
    isValidBreakdownValue(typed.senior) &&
    isValidBreakdownValue(typed.junior) &&
    isValidBreakdownValue(typed.resident) &&
    isValidBreakdownValue(typed.replay) &&
    isValidBreakdownValue(typed.frequent_play)
  );
}

function calculateAdjustedTotal(breakdown: PlayerBreakdown): number {
  const standardTotal = breakdown.standard * 23;
  const discounted20Total =
    (breakdown.senior + breakdown.junior + breakdown.resident) * 20;
  const discounted16Total =
    (breakdown.replay + breakdown.frequent_play) * 16;

  return standardTotal + discounted20Total + discounted16Total;
}

function toSafeNumber(value: number): number {
  return Number(value.toFixed(2));
}

async function generateUniqueConfirmationCode(
  codeExists: (code: string) => Promise<boolean>,
): Promise<string> {
  for (let attempts = 0; attempts < 40; attempts++) {
    const fourDigits = Math.floor(1000 + Math.random() * 9000);
    const code = `MP-${fourDigits}`;
    const exists = await codeExists(code);
    if (!exists) {
      return code;
    }
  }

  throw new Error("Could not generate unique confirmation code.");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateBookingRequest;

    const teeTimeId = body.tee_time_id?.trim();
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const playerCount = body.player_count;
    const notes = body.notes?.trim() || null;
    const playerBreakdown = body.player_breakdown;

    if (!teeTimeId || !name || !email || !phone || !playerBreakdown) {
      return Response.json(
        { error: "Please fill out all required booking fields." },
        { status: 400 },
      );
    }

    if (!hasValidBreakdownShape(playerBreakdown)) {
      return Response.json(
        { error: "Player breakdown is invalid." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(playerCount) || playerCount < 1 || playerCount > 4) {
      return Response.json(
        { error: "Player count must be between 1 and 4." },
        { status: 400 },
      );
    }

    const breakdownTotal = sumBreakdown(playerBreakdown);
    if (breakdownTotal !== playerCount) {
      return Response.json(
        {
          error:
            "Player breakdown must exactly match the selected player count.",
        },
        { status: 400 },
      );
    }

    const supabase: any = createServiceRoleClient();

    const { data: teeTime, error: teeTimeError } = await supabase
      .from("tee_times")
      .select("id,status")
      .eq("id", teeTimeId)
      .maybeSingle();

    if (teeTimeError) {
      console.error("Failed to read tee time before booking", teeTimeError);
      return Response.json(
        { error: "Unable to complete booking right now." },
        { status: 500 },
      );
    }

    if (!teeTime || teeTime.status !== "available") {
      return Response.json(
        {
          error:
            "That tee time is no longer available. Please pick a different time.",
        },
        { status: 409 },
      );
    }

    const { data: existingGolfer, error: golferLookupError } = await supabase
      .from("golfers")
      .select("id,is_flagged")
      .eq("email", email)
      .maybeSingle();

    if (golferLookupError) {
      console.error("Failed to look up golfer by email", golferLookupError);
      return Response.json(
        { error: "Unable to complete booking right now." },
        { status: 500 },
      );
    }

    let golferId = existingGolfer?.id;
    let golferIsFlagged = existingGolfer?.is_flagged ?? false;

    if (!golferId) {
      const { data: newGolfer, error: createGolferError } = await supabase
        .from("golfers")
        .insert({
          email,
          name,
          phone,
        })
        .select("id,is_flagged")
        .single();

      if (createGolferError) {
        console.error("Failed to create golfer", createGolferError);
        return Response.json(
          { error: "Unable to complete booking right now." },
          { status: 500 },
        );
      }

      golferId = newGolfer.id;
      golferIsFlagged = newGolfer.is_flagged;
    }

    if (golferIsFlagged) {
      return Response.json(
        {
          error:
            "This account has been flagged due to repeated no-shows. Please contact the pro shop directly to book.",
        },
        { status: 403 },
      );
    }

    const confirmationCode = await generateUniqueConfirmationCode(async (code) => {
      const { data: existingCode, error: codeLookupError } = await supabase
        .from("bookings")
        .select("id")
        .eq("confirmation_code", code)
        .maybeSingle();

      if (codeLookupError) {
        throw codeLookupError;
      }

      return Boolean(existingCode);
    });

    const totalPrice = toSafeNumber(playerCount * ONLINE_RATE);
    const adjustedTotal = toSafeNumber(calculateAdjustedTotal(playerBreakdown));
    const estimatedAdjustment = toSafeNumber(adjustedTotal - totalPrice);

    const now = new Date().toISOString();
    const { data: booking, error: bookingInsertError } = await supabase
      .from("bookings")
      .insert({
        confirmation_code: confirmationCode,
        tee_time_id: teeTimeId,
        golfer_id: golferId,
        player_count: playerCount,
        player_breakdown: playerBreakdown,
        total_price: totalPrice,
        estimated_adjustment: estimatedAdjustment,
        notes,
        status: "confirmed",
        updated_at: now,
      })
      .select("id,tee_time_id,golfer_id,player_count,total_price,estimated_adjustment,status,created_at")
      .single();

    if (bookingInsertError) {
      console.error("Failed to create booking record", bookingInsertError);
      return Response.json(
        { error: "Unable to complete booking right now." },
        { status: 500 },
      );
    }

    let teeTimeMarkedBooked = false;
    try {
      const { data: teeTimeUpdateResult, error: teeTimeUpdateError } = await supabase
        .from("tee_times")
        .update({ status: "booked" })
        .eq("id", teeTimeId)
        .eq("status", "available")
        .select("id");

      if (teeTimeUpdateError) {
        throw teeTimeUpdateError;
      }

      if (!teeTimeUpdateResult || teeTimeUpdateResult.length === 0) {
        await supabase.from("bookings").delete().eq("id", booking.id);

        return Response.json(
          {
            error:
              "That tee time was just booked by someone else. Please pick a different time.",
          },
          { status: 409 },
        );
      }

      teeTimeMarkedBooked = true;

      const { error: golferUpdateError } = await supabase
        .from("golfers")
        .update({ last_booking_at: new Date().toISOString() })
        .eq("id", golferId);

      if (golferUpdateError) {
        throw golferUpdateError;
      }
    } catch (postInsertError) {
      console.error("Post-booking operations failed", postInsertError);

      if (teeTimeMarkedBooked) {
        await supabase
          .from("tee_times")
          .update({ status: "available" })
          .eq("id", teeTimeId);
      }

      await supabase.from("bookings").delete().eq("id", booking.id);

      return Response.json(
        { error: "Unable to complete booking right now." },
        { status: 500 },
      );
    }

    const response: CreateBookingResponse = {
      confirmation_code: confirmationCode,
      booking: {
        id: booking.id,
        tee_time_id: booking.tee_time_id,
        golfer_id: booking.golfer_id,
        player_count: booking.player_count,
        total_price: Number(booking.total_price),
        estimated_adjustment: Number(booking.estimated_adjustment),
        status: booking.status,
        created_at: booking.created_at,
      },
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    console.error("Unexpected booking creation error", error);
    return Response.json(
      { error: "Unable to complete booking right now." },
      { status: 500 },
    );
  }
}
