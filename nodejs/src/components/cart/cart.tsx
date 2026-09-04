export type CartItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export function Cart({ items }: { items: CartItem[] }) {
  return <aside aria-label="Carrello">{items.length === 0 ? "Il carrello è vuoto" : `${items.length} prodotti nel carrello`}</aside>;
}
