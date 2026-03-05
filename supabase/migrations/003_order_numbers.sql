-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- Adds human-readable order numbers (e.g. AXIS-100001) for customer support

create sequence if not exists orders_order_number_seq start 100000;

alter table public.orders add column if not exists order_number text unique;

-- Backfill existing orders (DEFAULT does not apply to existing rows)
do $$
declare r record;
begin
  for r in select id from public.orders where order_number is null
  loop
    update public.orders
    set order_number = 'AXIS-' || lpad(nextval('orders_order_number_seq')::text, 6, '0')
    where id = r.id;
  end loop;
end $$;

alter table public.orders
  alter column order_number set default ('AXIS-' || lpad(nextval('orders_order_number_seq')::text, 6, '0'));

create unique index if not exists orders_order_number_idx on public.orders (order_number);
