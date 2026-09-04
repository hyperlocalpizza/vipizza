import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { OrderFlow } from "@/app/order-flow";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

type Pizza = { id: string; name: string; description: string | null; price: number };
type Slot = { id: string; start_time: string; max_pizzas: number; reserved_pizzas: number };

const fallbackPizzas: Pizza[] = [
  { id: "00000000-0000-0000-0000-000000000001", name: "Margherita", description: "Pomodoro, fiordilatte, basilico", price: 8.5 },
  { id: "00000000-0000-0000-0000-000000000002", name: "Diavola", description: "Pomodoro, fiordilatte, salame piccante", price: 10.5 },
  { id: "00000000-0000-0000-0000-000000000003", name: "Ortolana", description: "Verdure di stagione, mozzarella, olio al basilico", price: 11 }
];

function createFallbackSlots(): Slot[] {
  return ["17:00", "18:00", "19:00", "20:00", "21:00"].map((startTime, index) => ({ id: `10000000-0000-0000-0000-00000000000${index + 1}`, start_time: startTime, max_pizzas: 10, reserved_pizzas: 0 }));
}

async function getMenu() {
  try {
    const supabase = await createClient();
    const [{ data: pizzas }, { data: slots }] = await Promise.all([
      supabase.from("pizzas").select("id, name, description, price").eq("available", true).order("name"),
      supabase.from("slots").select("id, start_time, max_pizzas, reserved_pizzas").eq("is_active", true).gte("start_time", "17:00").lte("start_time", "21:00").order("start_time")
    ]);
    return { pizzas: (pizzas as Pizza[] | null) || [], slots: (slots as Slot[] | null) || [] };
  } catch {
    return { pizzas: [], slots: [] };
  }
}

export default async function HomePage() {
  const menu = await getMenu();
  const pizzas = menu.pizzas.length ? menu.pizzas : fallbackPizzas;
  const slots = (menu.slots.length ? menu.slots : createFallbackSlots()).map((slot) => ({ id: slot.id, startTime: slot.start_time.slice(0, 5), maxPizzas: slot.max_pizzas, reservedPizzas: slot.reserved_pizzas }));

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-[var(--border)] pb-5"><a href="#menu" className="flex items-center gap-4 font-bold"><Image src="/hlp-logo.png" alt="VIPizza" width={192} height={192} className="h-40 w-40 object-contain sm:h-48 sm:w-48" /> <span className="text-4xl leading-none sm:text-5xl lg:text-6xl">VIPizza</span></a><Button variant="outline" size="icon" aria-label="Apri il carrello"><ShoppingBag size={18} /></Button></nav>
      <section className="mx-auto max-w-7xl border-b border-[var(--border)] py-12 sm:py-16 lg:py-20"><p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Pizza fatta bene</p><h1 className="max-w-3xl text-4xl font-bold leading-[0.98] sm:text-5xl lg:text-6xl">Il tuo momento caldo, appena sfornato.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">Scegli dal menu, prenota il tuo slot e ricevi la pizza ancora fumante.</p></section>
      <section id="menu" className="mx-auto max-w-7xl py-12"><OrderFlow pizzas={pizzas} slots={slots} /></section>
    </main>
  );
}
