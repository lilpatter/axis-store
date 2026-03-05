-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- Creates the orders table for storing Stripe checkout sessions

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  email text not null,
  items jsonb not null default '[]',
  total integer not null default 0,
  created_at timestamptz not null default now()
);

-- Index for fast lookups by email (used by /api/orders)
create index if not exists orders_email_idx on public.orders (email);
