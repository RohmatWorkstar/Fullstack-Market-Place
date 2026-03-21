-- Run this entire script in your Supabase SQL Editor

-- 1. Enable UUID generation
create extension if not exists "uuid-ossp";

-- 2. Clean up existing tables if you are re-running
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.cart_items cascade;
drop table if exists public.carts cascade;
drop table if exists public.products cascade;
drop table if exists public.profiles cascade;

-- 3. PROFILES Table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'buyer' check (role in ('buyer', 'seller')),
  avatar_url text,
  created_at timestamptz default now()
);

-- 4. PRODUCTS Table
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  price bigint not null check (price >= 0),
  category text not null,
  image_url text,
  stock int not null default 0 check (stock >= 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. CARTS Table (used for sync later if needed)
create table public.carts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);

-- 6. CART_ITEMS Table
create table public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  unique(cart_id, product_id)
);

-- 7. ORDERS Table
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  total bigint not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  payment_id text,
  created_at timestamptz default now()
);

-- 8. ORDER_ITEMS Table
create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  product_name text not null,
  product_price bigint not null,
  quantity int not null,
  subtotal bigint not null
);

-- 9. Automatic Profile Creation Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    coalesce(new.raw_user_meta_data->>'role', 'buyer')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists
drop trigger if exists on_auth_user_created on auth.users;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 10. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- PROFILES Policies
create policy "Public Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- PRODUCTS Policies
create policy "Products are viewable by everyone" on public.products for select using (true);
create policy "Sellers can insert their products" on public.products for insert with check (auth.uid() = seller_id);
create policy "Sellers can update their products" on public.products for update using (auth.uid() = seller_id);
create policy "Sellers can delete their products" on public.products for delete using (auth.uid() = seller_id);

-- ORDERS Policies
create policy "Users can view their own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert their own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Users can update their own orders" on public.orders for update using (auth.uid() = user_id);

-- ORDER ITEMS Policies
create policy "Users can view their own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Users can insert their own order items" on public.order_items for insert with check (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

-- 11. Storage Setup
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Product images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

create policy "Anyone can upload product images"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' );

create policy "Users can delete own product images"
  on storage.objects for delete
  using ( bucket_id = 'product-images' and auth.role() = 'authenticated' );

-- 12. Create Indexes for performance
create index if not exists idx_products_seller on public.products(seller_id);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_order_items_order on public.order_items(order_id);
