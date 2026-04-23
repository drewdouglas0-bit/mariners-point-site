-- GOLFERS
create table golfers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  phone text not null,
  no_show_count integer not null default 0,
  is_flagged boolean not null default false,
  flagged_reason text,
  created_at timestamptz not null default now(),
  last_booking_at timestamptz
);

-- RATES
create table rates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_per_player decimal(10,2) not null,
  description text,
  requires_verification boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- TEE TIMES
create table tee_times (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time time not null,
  max_players integer not null default 4,
  price_per_player decimal(10,2) not null default 23.00,
  status text not null default 'available'
    check (status in ('available', 'booked', 'blocked', 'closed')),
  blocked_reason text,
  blocked_by text,
  created_at timestamptz not null default now(),
  unique(date, start_time)
);

-- BOOKINGS
create table bookings (
  id uuid primary key default gen_random_uuid(),
  confirmation_code text unique not null,
  tee_time_id uuid not null references tee_times(id),
  golfer_id uuid not null references golfers(id),
  player_count integer not null check (player_count between 1 and 4),
  player_breakdown jsonb not null default '{"standard":0,"senior":0,"junior":0,"resident":0,"replay":0,"frequent_play":0}',
  total_price decimal(10,2) not null,
  estimated_adjustment decimal(10,2) not null default 0,
  status text not null default 'confirmed'
    check (status in ('confirmed','cancelled','completed','no_show')),
  cancelled_at timestamptz,
  cancellation_reason text,
  reminder_sent_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- BLOCKED TIMES
create table blocked_times (
  id uuid primary key default gen_random_uuid(),
  start_datetime timestamptz not null,
  end_datetime timestamptz not null,
  reason text not null,
  blocked_by text not null,
  created_at timestamptz not null default now()
);

-- ADMIN USERS
create table admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  role text not null default 'staff'
    check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

-- SEED RATES
insert into rates (name, price_per_player, description, requires_verification) values
  ('Standard', 23.00, 'Standard green fee — all ages', false),
  ('Senior (60+)', 20.00, 'Golfers aged 60 and over — ID verified at pro shop', true),
  ('Junior (16 and under)', 20.00, 'Golfers aged 16 and under — ID verified at pro shop', true),
  ('Foster City Resident', 20.00, 'Foster City residents — proof of residency at pro shop', true),
  ('Replay', 16.00, 'Same-day second round — verified at pro shop', true),
  ('Frequent Play Card', 16.00, 'Prepaid 10-round card — card presented at pro shop', true);