-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- Adds tracking number for package tracking
-- Add tracking numbers via: UPDATE orders SET tracking_number = 'CY012508740DE' WHERE id = 'xxx';

alter table public.orders add column if not exists tracking_number text;
