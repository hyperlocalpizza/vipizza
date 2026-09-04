alter table public.orders
  add column stripe_session_id text;

create unique index orders_stripe_session_id_idx
  on public.orders(stripe_session_id)
  where stripe_session_id is not null;
