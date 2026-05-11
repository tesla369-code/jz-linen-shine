import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBookings, deleteBooking, clearBookings, type StoredBooking } from "@/lib/bookings-store";
import { toast } from "sonner";
import { Trash2, Lock, Search } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Bookings | JZ Linen" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: Admin,
});

const PIN_KEY = "jz_admin_ok";
const ADMIN_PIN = "JzL!nen#2026$Swindon"; // local-only gate

function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [items, setItems] = useState<StoredBooking[]>([]);
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(PIN_KEY) === "1") setAuthed(true);
  }, []);

  useEffect(() => {
    if (authed) setItems(getBookings());
  }, [authed]);

  if (!authed) {
    return (
      <>
        <PageHero eyebrow="Admin" title="Sign in" sub="Enter the admin PIN to view bookings." />
        <section className="container-page py-16">
          <form
            className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-6 shadow-card"
            onSubmit={(e) => {
              e.preventDefault();
              if (pin === ADMIN_PIN) {
                sessionStorage.setItem(PIN_KEY, "1");
                setAuthed(true);
              } else toast.error("Wrong PIN");
            }}
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground"><Lock className="h-5 w-5" /></div>
            <label className="mb-1.5 block text-sm font-medium">Admin password</label>
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} className="h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <Button type="submit" variant="hero" size="lg" className="mt-4 w-full">Enter</Button>
            <p className="mt-3 text-xs text-muted-foreground">Local-only gate — bookings live in this browser.</p>
          </form>
        </section>
      </>
    );
  }

  const refresh = () => setItems(getBookings());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const fromTs = from ? new Date(from + "T00:00:00").getTime() : null;
    const toTs = to ? new Date(to + "T23:59:59").getTime() : null;
    return items.filter((b) => {
      if (q) {
        const hay = `${b.business} ${b.contact} ${b.email} ${b.phone} ${b.service} ${b.postcode} ${b.address} ${b.notes ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      const ts = new Date(b.createdAt).getTime();
      if (fromTs !== null && ts < fromTs) return false;
      if (toTs !== null && ts > toTs) return false;
      return true;
    });
  }, [items, query, from, to]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => { setPage(1); }, [query, from, to]);

  return (
    <>
      <PageHero eyebrow="Admin" title="Customer bookings" sub="Local-storage only. Data is visible on this device/browser." />
      <section className="container-page py-12">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {filtered.length} of {items.length} booking{items.length === 1 ? "" : "s"}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refresh}>Refresh</Button>
            <Button variant="outline" onClick={() => { sessionStorage.removeItem(PIN_KEY); setAuthed(false); }}>Sign out</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("Clear all bookings from this browser?")) { clearBookings(); refresh(); }
              }}
            >Clear all</Button>
          </div>
        </div>

        <div className="mb-4 grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-card sm:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search business, contact, email, phone, service, address…"
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-10 rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-10 rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <Button variant="outline" onClick={() => { setQuery(""); setFrom(""); setTo(""); }}>Reset</Button>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            {items.length === 0 ? "No bookings yet. New pickup requests will appear here." : "No bookings match your filters."}
          </div>
        ) : (
          <>
          <div className="rounded-2xl border border-border bg-card shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Received</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Slot</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{b.business}</TableCell>
                    <TableCell>{b.contact}</TableCell>
                    <TableCell><a className="text-primary hover:underline" href={`mailto:${b.email}`}>{b.email}</a></TableCell>
                    <TableCell><a className="text-primary hover:underline" href={`tel:${b.phone}`}>{b.phone}</a></TableCell>
                    <TableCell>{b.service}</TableCell>
                    <TableCell>{b.date}</TableCell>
                    <TableCell>{b.slot}</TableCell>
                    <TableCell className="max-w-[220px] text-xs">{b.postcode} — {b.address}</TableCell>
                    <TableCell className="max-w-[220px] text-xs text-muted-foreground">{b.notes || "—"}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => { deleteBooking(b.id); refresh(); }} aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages} · Showing {pageItems.length} of {filtered.length}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
              <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
          </>
        )}
      </section>
    </>
  );
}