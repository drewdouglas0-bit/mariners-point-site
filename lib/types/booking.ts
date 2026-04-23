export type PlayerBreakdown = {
  standard: number;
  senior: number;
  junior: number;
  resident: number;
  replay: number;
  frequent_play: number;
};

export type BookingStatus = "confirmed" | "cancelled" | "completed" | "no_show";
export type TeeTimeStatus = "available" | "booked" | "blocked" | "closed";

export interface TeeTime {
  id: string;
  date: string;
  start_time: string;
  max_players: number;
  price_per_player: number | string;
  status: TeeTimeStatus;
}

export interface Golfer {
  id: string;
  email: string;
  name: string;
  phone: string;
  no_show_count: number;
  is_flagged: boolean;
  flagged_reason: string | null;
  created_at: string;
  last_booking_at: string | null;
}

export interface Booking {
  id: string;
  confirmation_code: string;
  tee_time_id: string;
  golfer_id: string;
  player_count: number;
  player_breakdown: PlayerBreakdown;
  total_price: number | string;
  estimated_adjustment: number | string;
  status: BookingStatus;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  reminder_sent_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingRequest {
  tee_time_id: string;
  name: string;
  email: string;
  phone: string;
  player_count: number;
  player_breakdown: PlayerBreakdown;
  notes?: string;
}

export interface CreateBookingResponse {
  confirmation_code: string;
  booking: {
    id: string;
    tee_time_id: string;
    golfer_id: string;
    player_count: number;
    total_price: number;
    estimated_adjustment: number;
    status: BookingStatus;
    created_at: string;
  };
}

export interface CancelBookingRequest {
  confirmation_code: string;
  reason?: string;
}

export interface Database {
  public: {
    Tables: {
      tee_times: {
        Row: TeeTime & {
          blocked_reason: string | null;
          blocked_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          start_time: string;
          max_players?: number;
          price_per_player?: number;
          status?: TeeTimeStatus;
          blocked_reason?: string | null;
          blocked_by?: string | null;
          created_at?: string;
        };
        Update: {
          date?: string;
          start_time?: string;
          max_players?: number;
          price_per_player?: number;
          status?: TeeTimeStatus;
          blocked_reason?: string | null;
          blocked_by?: string | null;
        };
      };
      golfers: {
        Row: Golfer;
        Insert: {
          id?: string;
          email: string;
          name: string;
          phone: string;
          no_show_count?: number;
          is_flagged?: boolean;
          flagged_reason?: string | null;
          created_at?: string;
          last_booking_at?: string | null;
        };
        Update: {
          email?: string;
          name?: string;
          phone?: string;
          no_show_count?: number;
          is_flagged?: boolean;
          flagged_reason?: string | null;
          last_booking_at?: string | null;
        };
      };
      bookings: {
        Row: Booking;
        Insert: {
          id?: string;
          confirmation_code: string;
          tee_time_id: string;
          golfer_id: string;
          player_count: number;
          player_breakdown: PlayerBreakdown;
          total_price: number;
          estimated_adjustment: number;
          status?: BookingStatus;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          reminder_sent_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          confirmation_code?: string;
          tee_time_id?: string;
          golfer_id?: string;
          player_count?: number;
          player_breakdown?: PlayerBreakdown;
          total_price?: number;
          estimated_adjustment?: number;
          status?: BookingStatus;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          reminder_sent_at?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}
