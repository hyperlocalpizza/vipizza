-- Run after applying the initial migration in the Supabase SQL Editor.
-- The test creates temporary data and removes it before finishing.

do $$
declare
  test_slot_id uuid;
  first_reservation boolean;
  second_reservation boolean;
  final_reserved integer;
begin
  insert into public.slots (start_time, max_pizzas, reserved_pizzas, is_active)
  values ('23:59', 2, 0, true)
  returning id into test_slot_id;

  select public.check_and_reserve_slot(test_slot_id, 2)
    into first_reservation;

  if first_reservation is distinct from true then
    raise exception 'Expected the first reservation to succeed';
  end if;

  select public.check_and_reserve_slot(test_slot_id, 1)
    into second_reservation;

  if second_reservation is distinct from false then
    raise exception 'Expected the reservation over capacity to fail';
  end if;

  select reserved_pizzas
    into final_reserved
  from public.slots
  where id = test_slot_id;

  if final_reserved <> 2 then
    raise exception 'Expected reserved_pizzas to remain 2, got %', final_reserved;
  end if;

  delete from public.slots where id = test_slot_id;

  raise notice 'VIPizza schema test passed';
end;
$$;
