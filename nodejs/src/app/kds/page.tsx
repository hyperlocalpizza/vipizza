import { Clock3, Flame, CheckCircle2 } from "lucide-react";

const orders = [
  { id: "#1042", customer: "Luca B.", items: ["1x Diavola", "1x Margherita"], time: "12:18", status: "In preparazione" },
  { id: "#1041", customer: "Sara M.", items: ["2x Ortolana"], time: "12:11", status: "Da preparare" },
  { id: "#1040", customer: "Marco R.", items: ["1x Margherita"], time: "12:04", status: "Pronto" }
];

export default function KdsPage() {
  return (
    <main className="min-h-screen bg-[#25221f] px-6 py-8 text-[#fffaf3] md:px-12">
      <header className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#514941] pb-6">
        <div className="flex items-center gap-3"><Flame className="text-[#ed7658]" /><div><p className="text-xl font-bold">VIPizza KDS</p><p className="text-sm text-[#b9aaa0]">Cucina · turno pranzo</p></div></div>
        <div className="flex items-center gap-2 text-sm text-[#b9aaa0]"><Clock3 size={16} /> Aggiornato ora</div>
      </header>
      <section className="mx-auto max-w-7xl py-10">
        <div className="mb-8 flex items-end justify-between"><div><p className="text-sm uppercase tracking-[0.2em] text-[#ed7658]">Comande</p><h1 className="mt-2 text-4xl font-bold">Ordini in coda</h1></div><span className="border border-[#514941] px-4 py-2 text-sm">3 ordini attivi</span></div>
        <div className="grid gap-4 lg:grid-cols-3">
          {orders.map((order) => <article key={order.id} className="border border-[#514941] bg-[#302b27] p-6"><div className="flex justify-between"><span className="text-2xl font-bold">{order.id}</span><span className="text-sm text-[#b9aaa0]">{order.time}</span></div><p className="mt-2 text-[#ed7658]">{order.customer}</p><ul className="my-8 space-y-3 border-y border-[#514941] py-5 text-lg">{order.items.map((item) => <li key={item}>{item}</li>)}</ul><div className="flex items-center justify-between text-sm"><span className="text-[#b9aaa0]">{order.status}</span>{order.status === "Pronto" ? <CheckCircle2 className="text-[#8fca7a]" /> : <span className="h-3 w-3 bg-[#ed7658]" />}</div></article>)}
        </div>
      </section>
    </main>
  );
}
