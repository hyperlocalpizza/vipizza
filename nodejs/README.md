# VIPizza

Applicazione Next.js per ordini di pizza e gestione della cucina (KDS).

Il codice applicativo vive in `src/`: `src/app` contiene le pagine, mentre `src/components` e `src/lib` contengono rispettivamente componenti riutilizzabili e integrazioni.

## Sviluppo

1. Installa Node.js 20+.
2. Esegui `npm install`.
3. Copia `.env.example` in `.env.local` e inserisci le credenziali.
4. Avvia `npm run dev`.

Le pagine disponibili sono `/` per i clienti e `/kds` per la cucina.

## Database Supabase

Lo schema iniziale è nella migrazione [`supabase/migrations/20260904000000_initial_schema.sql`](supabase/migrations/20260904000000_initial_schema.sql). Puoi eseguirla dal SQL Editor di Supabase oppure con la Supabase CLI.

La RPC `check_and_reserve_slot(p_slot_id, p_requested_quantity)` riserva le pizze in modo atomico e restituisce `false` se lo slot non è attivo o non ha capienza sufficiente.

Dopo aver applicato la migrazione, esegui anche [`supabase/tests/initial_schema.sql`](supabase/tests/initial_schema.sql) nel SQL Editor. Il test crea uno slot temporaneo, verifica una prenotazione valida e una oltre capienza, quindi rimuove i dati di prova.

Per collegare la CLI al progetto Supabase remoto:

```powershell
npx supabase login
npx supabase link --project-ref myuseurteyafkpddpczp
npx supabase db push
```

`supabase login` apre la procedura di autenticazione. Non usare `supabase start` per il progetto remoto: quel comando richiede Docker e avvia un database locale.

Per caricare il menu demo nel progetto remoto, copia [`supabase/seed.sql`](supabase/seed.sql) nel SQL Editor ed eseguilo dopo le migrazioni. Il webhook Stripe deve puntare a `/api/stripe/webhook` e usare `STRIPE_WEBHOOK_SECRET`.

`order_items` non contiene le pizze del menu: collega le pizze agli ordini. Viene popolata automaticamente dal webhook dopo un pagamento Stripe. Per verificarla senza pagare, esegui [`supabase/tests/order_items.sql`](supabase/tests/order_items.sql) dopo il seed; il test usa una transazione e non lascia dati.
