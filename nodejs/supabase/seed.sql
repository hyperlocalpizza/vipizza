insert into public.pizzas (id, name, description, price, available)
values
  ('00000000-0000-0000-0000-000000000001', 'Margherita', 'Pomodoro, fiordilatte, basilico', 8.50, true),
  ('00000000-0000-0000-0000-000000000002', 'Diavola', 'Pomodoro, fiordilatte, salame piccante', 10.50, true),
  ('00000000-0000-0000-0000-000000000003', 'Ortolana', 'Verdure di stagione, mozzarella, olio al basilico', 11.00, true),
  ('00000000-0000-0000-0000-000000000004', 'Bufalina', 'Pomodoro, mozzarella di bufala, basilico', 12.00, true),
  ('00000000-0000-0000-0000-000000000005', 'Quattro formaggi', 'Fiordilatte, gorgonzola, fontina, parmigiano', 12.50, true),
  ('00000000-0000-0000-0000-000000000006', 'Prosciutto e funghi', 'Pomodoro, fiordilatte, prosciutto cotto, funghi', 11.50, true)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  available = excluded.available;

insert into public.slots (id, start_time, max_pizzas, reserved_pizzas, is_active)
values
  ('10000000-0000-0000-0000-000000000001', '17:00', 10, 0, true),
  ('10000000-0000-0000-0000-000000000002', '18:00', 10, 0, true),
  ('10000000-0000-0000-0000-000000000003', '19:00', 10, 0, true),
  ('10000000-0000-0000-0000-000000000004', '20:00', 10, 0, true),
  ('10000000-0000-0000-0000-000000000005', '21:00', 10, 0, true)
on conflict (id) do update set
  start_time = excluded.start_time,
  max_pizzas = excluded.max_pizzas,
  is_active = excluded.is_active;
