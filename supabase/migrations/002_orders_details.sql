-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- Adds order details: address, payment method, shipping
-- Run after 001_orders.sql

alter table public.orders
add column if not exists details jsonb default '{}';
