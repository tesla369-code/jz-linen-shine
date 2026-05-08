export type StoredBooking = {
  id: string;
  createdAt: string;
  business: string;
  contact: string;
  email: string;
  phone: string;
  postcode: string;
  address: string;
  service: string;
  date: string;
  slot: string;
  notes?: string;
};

const KEY = "jz_bookings_v1";

export function getBookings(): StoredBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredBooking[]) : [];
  } catch {
    return [];
  }
}

export function saveBooking(b: Omit<StoredBooking, "id" | "createdAt">): StoredBooking {
  const entry: StoredBooking = {
    ...b,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const all = [entry, ...getBookings()];
  localStorage.setItem(KEY, JSON.stringify(all));
  return entry;
}

export function deleteBooking(id: string) {
  const all = getBookings().filter((b) => b.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function clearBookings() {
  localStorage.removeItem(KEY);
}