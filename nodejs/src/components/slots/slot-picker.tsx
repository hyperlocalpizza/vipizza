export type PickupSlot = {
  id: string;
  label: string;
  available: boolean;
};

export function SlotPicker({ slots }: { slots: PickupSlot[] }) {
  return <select aria-label="Scegli l'orario di ritiro" defaultValue=""><option value="" disabled>Seleziona un orario</option>{slots.map((slot) => <option key={slot.id} value={slot.id} disabled={!slot.available}>{slot.label}</option>)}</select>;
}
