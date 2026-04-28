export type BookingStatus = "confirmed" | "cancelled" | "completed" | "no_show";

export type TeeSheetSlot = {
  id: string;
  date: string;
  start_time: string;
  status: "available" | "booked" | "blocked" | "closed";
  blocked_reason: string | null;
  blocked_by: string | null;
  booking: null | {
    id: string;
    confirmation_code: string;
    status: BookingStatus;
    player_count: number;
    notes: string | null;
    player_breakdown: Record<string, number>;
    golfer: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
  };
};

export type FlaggedGolfer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  no_show_count: number;
  flagged_reason: string | null;
  last_booking_at: string | null;
};
