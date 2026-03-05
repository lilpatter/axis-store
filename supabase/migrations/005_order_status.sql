-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- Adds order_status for admin workflow (paid, shipped, delivered)

alter table public.orders add column if not exists order_status text default 'paid';
