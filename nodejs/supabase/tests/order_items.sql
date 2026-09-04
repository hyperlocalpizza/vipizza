-- Run after the migrations and seed.sql in the Supabase SQL Editor.
-- This verifies the foreign-key flow orders -> order_items -> pizzas.

begin;

do $$
declare
  test_order_id uuid := '20000000-0000-0000-0000-000000000001';
  test_slot_id uuid := '10000000-0000-0000-0000-000000000001';
  test_pizza_id uuid := '00000000-0000-0000-0000-000000000001';
  inserted_items integer;
begin
  if not exists (select 1 from public.slots where id = test_slot_id) then
    raise exception 'Test slot not found. Run supabase/seed.sql first.';
  end if;

  if not exists (select 1 from public.pizzas where id = test_pizza_id) then
    raise exception 'Test pizza not found. Run supabase/seed.sql first.';
  end if;

  insert into public.orders (
    id,
    customer_name,
    customer_address,
    phone,
    slot_id,
    total_amount,
    status
  ) values (
    test_order_id,
    'Test cliente',
    'Via Test 1, Torino',
    '3330000000',
    test_slot_id,
    8.50,
    'pending'
  );

  insert into public.order_items (order_id, pizza_id, quantity)
  values (test_order_id, test_pizza_id, 1);

  select count(*)
    into inserted_items
  from public.order_items
  where order_id = test_order_id;

  if inserted_items <> 1 then
    raise exception 'Expected one order item, got %', inserted_items;
  end if;

  raise notice 'order_items test passed';
end;
$$;

rollback;
