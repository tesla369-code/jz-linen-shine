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

function getStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new Error("Local storage is not available");
  }
  return window.localStorage;
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `booking-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getBookings(): StoredBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = getStorage().getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as StoredBooking[]) : [];
  } catch {
    return [];
  }
}

export function saveBooking(b: Omit<StoredBooking, "id" | "createdAt">): StoredBooking {
  const entry: StoredBooking = {
    ...b,
    id: createId(),
    createdAt: new Date().toISOString(),
  };
  const all = [entry, ...getBookings()];
  getStorage().setItem(KEY, JSON.stringify(all));
  return entry;
}

export function deleteBooking(id: string) {
  const all = getBookings().filter((b) => b.id !== id);
  getStorage().setItem(KEY, JSON.stringify(all));
}

export function clearBookings() {
  getStorage().removeItem(KEY);
}
