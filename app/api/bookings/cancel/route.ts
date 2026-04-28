import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendCancellationConfirmation } from "@/lib/email/send-confirmation";
import type { CancelBookingRequest } from "@/lib/types/booking";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CancelBookingRequest;
    const confirmationCode = body.confirmation_code?.trim().toUpperCase();
    const cancellationReason = body.reason?.trim() ?? null;

    if (!confirmationCode) {
      return Response.json(
        { error: "Confirmation code is required." },
        { status: 400 },
      );
    }

    const supabase = createServiceRoleClient();

    const { data: booking, error: fetchBookingError } = await supabase
      .from("bookings")
      .select("id,status,tee_time_id,golfer_id,player_count")
      .eq("confirmation_code", confirmationCode)
      .maybeSingle();

    if (fetchBookingError) {
      console.error("Failed to fetch booking for cancellation", fetchBookingError);
      return Response.json(
        { error: "Unable to process cancellation right now." },
        { status: 500 },
      );
    }

    if (!booking) {
      return Response.json(
        { error: "Booking not found for that confirmation code." },
        { status: 404 },
      );
    }

    if (booking.status !== "confirmed") {
      return Response.json(
        { error: "This booking cannot be cancelled because it is no longer active." },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const { error: updateBookingError } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancelled_at: now,
        cancellation_reason: cancellationReason,
        updated_at: now,
      })
      .eq("id", booking.id);

    if (updateBookingError) {
      console.error("Failed to mark booking as cancelled", updateBookingError);
      return Response.json(
        { error: "Unable to process cancellation right now." },
        { status: 500 },
      );
    }

    const { error: teeTimeError } = await supabase
      .from("tee_times")
      .update({ status: "available" })
      .eq("id", booking.tee_time_id);

    if (teeTimeError) {
      console.error("Failed to reopen tee time during cancellation", teeTimeError);

      await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          cancelled_at: null,
          cancellation_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", booking.id);

      return Response.json(
        { error: "Unable to process cancellation right now." },
        { status: 500 },
      );
    }

    try {
      const [{ data: golfer, error: golferError }, { data: teeTime, error: teeTimeFetchError }] =
        await Promise.all([
          supabase
            .from("golfers")
            .select("name,email")
            .eq("id", booking.golfer_id)
            .maybeSingle(),
          supabase
            .from("tee_times")
            .select("date,start_time")
            .eq("id", booking.tee_time_id)
            .maybeSingle(),
        ]);

      if (golferError) {
        console.error("Failed to fetch golfer details for cancellation email", golferError);
      }
      if (teeTimeFetchError) {
        console.error("Failed to fetch tee time details for cancellation email", teeTimeFetchError);
      }

      if (golfer?.email && golfer?.name && teeTime?.date && teeTime?.start_time) {
        await sendCancellationConfirmation({
          to: golfer.email,
          name: golfer.name,
          confirmationCode,
          date: teeTime.date,
          startTime: teeTime.start_time,
          playerCount: booking.player_count,
        });
      } else {
        console.error("Missing cancellation email details; email not sent", {
          hasGolferEmail: Boolean(golfer?.email),
          hasGolferName: Boolean(golfer?.name),
          hasDate: Boolean(teeTime?.date),
          hasStartTime: Boolean(teeTime?.start_time),
        });
      }
    } catch (emailError) {
      console.error("Cancellation confirmation email failed", emailError);
    }

    return Response.json({
      success: true,
      message:
        "Your booking has been cancelled. The tee time is now available for other golfers.",
    });
  } catch (error) {
    console.error("Unexpected cancellation error", error);
    return Response.json(
      { error: "Unable to process cancellation right now." },
      { status: 500 },
    );
  }
}
