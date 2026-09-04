"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Clock3, MapPin, Minus, Phone, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

type Pizza = { id: string; name: string; description: string | null; price: number };
type Slot = { id: string; startTime: string; maxPizzas: number; reservedPizzas: number };
type Cart = Record<string, number>;

type OrderFlowProps = { pizzas: Pizza[]; slots: Slot[] };

const serviceAreaPattern = /torino|moncalieri|nichelino|beinasco/i;
const formatPrice = (value: number) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(value);

export function OrderFlow({ pizzas, slots }: OrderFlowProps) {
  const [cart, setCart] = useState<Cart>({});
  const [selectedSlot, setSelectedSlot] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const cartItems = useMemo(() => pizzas.filter((pizza) => cart[pizza.id]).map((pizza) => ({ ...pizza, quantity: cart[pizza.id] })), [cart, pizzas]);
  const pizzaCount = cartItems.reduce((total, pizza) => total + pizza.quantity, 0);
  const total = cartItems.reduce((sum, pizza) => sum + pizza.price * pizza.quantity, 0);
  const addressInArea = address.length === 0 || serviceAreaPattern.test(address);

  function updateQuantity(id: string, quantity: number) {
    setCart((current) => {
      const next = { ...current };
      if (quantity > 0) next[id] = quantity;
      else delete next[id];
      return next;
    });
  }

  async function handleCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!pizzaCount || !selectedSlot || !address || !phone || !addressInArea) {
      setError("Completa i dati e scegli uno slot disponibile.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slotId: selectedSlot, address, phone, items: cartItems.map(({ id, quantity }) => ({ pizzaId: id, quantity })) }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Checkout non disponibile.");
      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout non disponibile.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:items-start">
      <section id="menu">
        <div className="mb-6 flex items-end justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Il menu</p><h2 className="mt-2 text-4xl font-bold">Scegli la tua pizza</h2></div><span className="text-sm text-[var(--muted)]">{pizzaCount} pizze</span></div>
        <div className="grid gap-4 sm:grid-cols-2">
          {pizzas.map((pizza) => <article key={pizza.id} className="border border-[var(--border)] bg-white p-5 shadow-[0_12px_30px_rgba(112,72,41,0.05)]"><div className="mb-5 flex aspect-[1.6] items-center justify-center bg-[#f7e4d3] text-5xl text-[var(--accent)]">✦</div><h3 className="text-2xl font-bold">{pizza.name}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-[var(--muted)]">{pizza.description || "Ingredienti freschi e impasto a lunga lievitazione."}</p><div className="mt-5 flex items-center justify-between"><span className="font-bold">{formatPrice(pizza.price)}</span><div className="flex items-center gap-2 border border-[var(--border)] p-1"><button type="button" aria-label={`Riduci ${pizza.name}`} className="p-1.5" onClick={() => updateQuantity(pizza.id, (cart[pizza.id] || 0) - 1)}><Minus size={15} /></button><span className="min-w-5 text-center text-sm">{cart[pizza.id] || 0}</span><button type="button" aria-label={`Aggiungi ${pizza.name}`} className="p-1.5 text-[var(--accent)]" onClick={() => updateQuantity(pizza.id, (cart[pizza.id] || 0) + 1)}><Plus size={15} /></button></div></div></article>)}
        </div>
      </section>
      <aside className="border border-[var(--border)] bg-white p-6 shadow-[0_16px_40px_rgba(112,72,41,0.07)] lg:sticky lg:top-6">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-5"><h2 className="text-2xl font-bold">Il tuo ordine</h2><ShoppingBag className="text-[var(--accent)]" size={21} /></div>
        <div className="space-y-3 py-5">{cartItems.length === 0 ? <p className="text-sm text-[var(--muted)]">Aggiungi una pizza per iniziare.</p> : cartItems.map((pizza) => <div key={pizza.id} className="flex justify-between text-sm"><span>{pizza.quantity} × {pizza.name}</span><span className="font-bold">{formatPrice(pizza.price * pizza.quantity)}</span></div>)}</div>
        <div className="flex justify-between border-t border-[var(--border)] py-5 text-lg font-bold"><span>Totale</span><span>{formatPrice(total)}</span></div>
        <form className="space-y-4" onSubmit={handleCheckout}><label className="block text-sm font-bold">Ritiro / consegna<input required value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Via Roma 12, Torino" className="mt-2 w-full border border-[var(--border)] bg-[var(--background)] px-3 py-3 font-normal outline-none focus:border-[var(--accent)]" /></label>{address && <p className={`text-xs ${addressInArea ? "text-[#4b7b4d]" : "text-[var(--accent)]"}`}>{addressInArea ? "Indirizzo nella zona di consegna." : "Siamo ancora in una zona più piccola: prova Torino e comuni vicini."}</p>}<label className="block text-sm font-bold">Numero di telefono<div className="relative mt-2"><Phone size={16} className="absolute left-3 top-3.5 text-[var(--muted)]" /><input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="333 123 4567" className="w-full border border-[var(--border)] bg-[var(--background)] py-3 pl-10 pr-3 font-normal outline-none focus:border-[var(--accent)]" /></div></label><fieldset><legend className="mb-2 text-sm font-bold">Scegli l&apos;orario</legend><div className="space-y-2">{slots.map((slot) => { const remaining = slot.maxPizzas - slot.reservedPizzas; const disabled = remaining < pizzaCount || pizzaCount === 0; return <label key={slot.id} className={`flex cursor-pointer items-center justify-between border px-3 py-3 text-sm ${disabled ? "cursor-not-allowed border-[#eee5dc] text-[#b8aca1]" : selectedSlot === slot.id ? "border-[var(--accent)] bg-[#fff4ec]" : "border-[var(--border)]"}`}><span className="flex items-center gap-2"><input type="radio" name="slot" value={slot.id} checked={selectedSlot === slot.id} onChange={() => setSelectedSlot(slot.id)} disabled={disabled} /><Clock3 size={15} />{slot.startTime}</span><span>{disabled ? "Completo" : `${remaining} posti`}</span></label>})}</div></fieldset>{error && <p role="alert" className="border border-[#e6b8aa] bg-[#fff1ed] p-3 text-sm text-[var(--accent-dark)]">{error}</p>}<Button type="submit" className="w-full" disabled={isSubmitting || !pizzaCount}>{isSubmitting ? "Apertura checkout..." : <>Vai al pagamento <ArrowRight size={17} /></>}</Button><p className="flex items-center gap-2 text-xs text-[var(--muted)]"><MapPin size={14} /> Consegna locale, pagamenti sicuri con Stripe.</p></form>
      </aside>
    </div>
  );
}
