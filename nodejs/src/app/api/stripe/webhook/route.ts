import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeServer } from "@/lib/stripe/server";

type CheckoutItem = { pizzaId: string; quantity: number };

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook Stripe non configurato." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripeServer().webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Firma webhook non valida." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid" || !session.id) {
    return NextResponse.json({ received: true });
  }

  const metadata = session.metadata || {};
  let items: CheckoutItem[];
  try {
    items = JSON.parse(metadata.items || "[]") as CheckoutItem[];
  } catch {
    return NextResponse.json({ error: "Metadati ordine non validi." }, { status: 400 });
  }

  if (!metadata.slot_id || !metadata.address || !metadata.phone || items.length === 0) {
    return NextResponse.json({ error: "Metadati ordine incompleti." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: existingOrder, error: lookupError } = await supabase.from("orders").select("id").eq("stripe_session_id", session.id).maybeSingle();
  if (lookupError) return NextResponse.json({ error: "Impossibile verificare l'ordine." }, { status: 500 });
  if (existingOrder) return NextResponse.json({ received: true });

  const { data: order, error: orderError } = await supabase.from("orders").insert({
    customer_name: "Cliente web",
    customer_address: metadata.address,
    phone: metadata.phone,
    slot_id: metadata.slot_id,
    total_amount: (session.amount_total || 0) / 100,
    status: "pending",
    stripe_session_id: session.id
  }).select("id").single();

  if (orderError || !order) return NextResponse.json({ error: "Impossibile creare l'ordine." }, { status: 500 });

  const { error: itemsError } = await supabase.from("order_items").insert(items.map((item) => ({ order_id: order.id, pizza_id: item.pizzaId, quantity: item.quantity })));
  if (itemsError) return NextResponse.json({ error: "Impossibile salvare gli articoli dell'ordine." }, { status: 500 });

  return NextResponse.json({ received: true });
}
