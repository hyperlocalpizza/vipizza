create extension if not exists pgcrypto;

create table public.slots (
  id uuid primary key default gen_random_uuid(),
  start_time time without time zone not null,
  max_pizzas integer not null default 10 check (max_pizzas > 0),
  reserved_pizzas integer not null default 0 check (reserved_pizzas >= 0),
  is_active boolean not null default true
);

create table public.pizzas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  available boolean not null default true
);

create type public.order_status as enum (
  'pending',
  'accepted',
  'in_prep',
  'delivering',
  'rejected'
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_address text not null,
  phone text not null,
  slot_id uuid not null references public.slots(id),
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  status public.order_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  pizza_id uuid not null references public.pizzas(id),
  quantity integer not null check (quantity > 0)
);

create index orders_slot_id_idx on public.orders(slot_id);
create index orders_status_idx on public.orders(status);
create index order_items_order_id_idx on public.order_items(order_id);
create index order_items_pizza_id_idx on public.order_items(pizza_id);

create or replace function public.check_and_reserve_slot(
  p_slot_id uuid,
  p_requested_quantity integer
)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
begin
  if p_requested_quantity is null or p_requested_quantity <= 0 then
    return false;
  end if;

  update public.slots
  set reserved_pizzas = reserved_pizzas + p_requested_quantity
  where id = p_slot_id
    and is_active = true
    and reserved_pizzas + p_requested_quantity <= max_pizzas;

  return found;
end;
$$;
