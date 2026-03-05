-- Products table for admin-managed catalog
-- Run in Supabase SQL Editor

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  price numeric not null check (price >= 0),
  original_price numeric check (original_price is null or original_price >= 0),
  category text not null,
  sub_category text,
  description text default '',
  images jsonb not null default '[]',
  sizes jsonb not null default '[]',
  colors jsonb not null default '[]',
  badge text check (badge in ('New', 'Sale', 'Bestseller')),
  in_stock boolean not null default true,
  sku text,
  brand text,
  metadata jsonb default '{}',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_category_idx on public.products (category);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();
