import { Pizza, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const pizzas = [
  { name: "Margherita", description: "Pomodoro, fiordilatte, basilico", price: "8,50 EUR" },
  { name: "Diavola", description: "Pomodoro, fiordilatte, salame piccante", price: "10,50 EUR" },
  { name: "Ortolana", description: "Verdure di stagione, mozzarella, olio al basilico", price: "11,00 EUR" }
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-12">
      <nav className="mx-auto flex max-w-6xl items-center justify-between border-b border-[#eadfd3] pb-6">
        <div className="flex items-center gap-2 text-xl font-bold"><Pizza className="text-[#c7462d]" /> VIPizza</div>
        <Button variant="outline" size="icon" aria-label="Apri il carrello"><ShoppingBag /></Button>
      </nav>
      <section className="mx-auto max-w-6xl py-20 md:py-28">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#c7462d]">Pizza fatta bene</p>
        <h1 className="max-w-3xl text-6xl font-bold leading-[0.95] md:text-8xl">Il tuo momento caldo, appena sfornato.</h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-[#756b61]">Scegli, personalizza e ritira la tua pizza preferita senza fare la fila.</p>
      </section>
      <section className="mx-auto max-w-6xl border-t border-[#eadfd3] py-10">
        <h2 className="mb-6 text-3xl font-bold">Il menu di oggi</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {pizzas.map((pizza) => (
            <article key={pizza.name} className="border border-[#eadfd3] bg-white p-6">
              <div className="mb-10 flex h-28 items-center justify-center bg-[#f8e7d5] text-[#c7462d]"><Pizza size={58} strokeWidth={1.3} /></div>
              <h3 className="text-2xl font-bold">{pizza.name}</h3>
              <p className="mt-2 min-h-12 text-[#756b61]">{pizza.description}</p>
              <div className="mt-6 flex items-center justify-between"><span className="font-bold">{pizza.price}</span><Button size="sm">Aggiungi</Button></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
