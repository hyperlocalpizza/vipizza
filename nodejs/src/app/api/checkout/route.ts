import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeServer } from "@/lib/stripe/server";

type CheckoutItem = { pizzaId: string; quantity: number };

type CheckoutBody = {
  slotId?: string;
  address?: string;
  phone?: string;
  items?: CheckoutItem[];
};

export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const items = body.items?.filter((item) => Number.isInteger(item.quantity) && item.quantity > 0) || [];
  if (!body.slotId || !body.address?.trim() || !body.phone?.trim() || items.length === 0) {
    return NextResponse.json({ error: "Dati ordine incompleti." }, { status: 400 });
  }

  const supabase = await createClient();
  const pizzaIds = items.map((item) => item.pizzaId);
  const { data: pizzas, error: pizzaError } = await supabase
    .from("pizzas")
    .select("id, name, price")
    .in("id", pizzaIds)
    .eq("available", true);

  if (pizzaError || !pizzas || pizzas.length !== new Set(pizzaIds).size) {
    return NextResponse.json({ error: "Una pizza selezionata non è più disponibile." }, { status: 409 });
  }

  const pizzaById = new Map(pizzas.map((pizza) => [pizza.id, pizza]));
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const { data: reserved, error: reserveError } = await supabase.rpc("check_and_reserve_slot", {
    p_slot_id: body.slotId,
    p_requested_quantity: totalQuantity
  });

  if (reserveError || reserved !== true) {
    return NextResponse.json({ error: "Questo slot non ha più abbastanza posti." }, { status: 409 });
  }

  try {
    const stripe = getStripeServer();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items.map((item) => {
        const pizza = pizzaById.get(item.pizzaId)!;
        return {
          quantity: item.quantity,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(Number(pizza.price) * 100),
            product_data: { name: pizza.name }
          }
        };
      }),
      phone_number_collection: { enabled: true },
      success_url: `${new URL(request.url).origin}/?checkout=success`,
      cancel_url: `${new URL(request.url).origin}/?checkout=cancelled`,
      metadata: { slot_id: body.slotId, address: body.address.trim(), phone: body.phone.trim(), items: JSON.stringify(items) }
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Pagamento temporaneamente non disponibile." }, { status: 503 });
  }
}
