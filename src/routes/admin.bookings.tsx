import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, Mail, Phone, MapPin, Calendar, Clock, RefreshCw, Search } from "lucide-react";

export const Route = createFileRoute("/admin/bookings")({
  head: () => ({ meta: [{ title: "Bookings — Admin | JZ Linen" }, { name: "robots", content: "noindex" }] }),
  component: AdminBookings,
});

type Booking = {
  id: string;
  business: string;
  contact: string;
  email: string;
  phone: string;
  postcode: string;
  address: string;
  service: string;
  date: string;
  slot: string;
  notes: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  confirmed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/15 text-destructive",
};

function AdminBookings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userEmail, setUserEmail] = useState("");

  async function loadBookings() {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Could not load bookings — admin role required.");
      setBookings([]);
      return;
    }
    setBookings((data || []) as Booking[]);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/admin/login" });
        return;
      }
      setUserEmail(session.user.email ?? "");
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin");
      if (!mounted) return;
      if (!roles || roles.length === 0) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      setAuthorized(true);
      await loadBookings();
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [navigate]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) { toast.error("Update failed"); return; }
    toast.success(`Marked as ${status}`);
    setBookings((b) => b.map((x) => x.id === id ? { ...x, status } : x));
    if (selected?.id === id) setSelected({ ...selected, status });
  }

  async function deleteBooking(id: string) {
    if (!confirm("Delete this booking permanently?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) { toast.error("Delete failed"); return; }
    toast.success("Deleted");
    setBookings((b) => b.filter((x) => x.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  if (loading) {
    return <section className="container-page py-20 text-center text-muted-foreground">Loading…</section>;
  }

  if (!authorized) {
    return (
      <section className="container-page py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
          <h1 className="font-display text-2xl font-bold">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({userEmail}) does not have admin access. Ask a database admin to grant you the <code className="rounded bg-muted px-1.5 py-0.5">admin</code> role.
          </p>
          <Button onClick={handleSignOut} variant="outline" className="mt-6">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </section>
    );
  }

  const filtered = bookings.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return [b.business, b.contact, b.email, b.phone, b.postcode, b.service]
      .some((f) => f?.toLowerCase().includes(q));
  });

  const counts = {
    all: bookings.length,
    new: bookings.filter((b) => b.status === "new").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <section className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Pickup bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">{userEmail} · {bookings.length} total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadBookings}><RefreshCw className="h-4 w-4" /> Refresh</Button>
          <Button variant="outline" size="sm" onClick={handleSignOut}><LogOut className="h-4 w-4" /> Sign out</Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {(["all", "new", "confirmed", "completed", "cancelled"] as const).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition ${statusFilter === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"}`}>
            {s} ({counts[s]})
          </button>
        ))}
        <div className="relative ml-auto w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bookings…"
            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          No bookings match your filter.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="max-h-[70vh] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                  <tr className="text-left">
                    <th className="p-3 font-semibold">Business</th>
                    <th className="p-3 font-semibold">Service</th>
                    <th className="p-3 font-semibold">Date</th>
                    <th className="p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} onClick={() => setSelected(b)}
                      className={`cursor-pointer border-t border-border transition hover:bg-muted/60 ${selected?.id === b.id ? "bg-muted" : ""}`}>
                      <td className="p-3">
                        <div className="font-medium">{b.business}</div>
                        <div className="text-xs text-muted-foreground">{b.contact} · {b.postcode}</div>
                      </td>
                      <td className="p-3 text-xs">{b.service}</td>
                      <td className="p-3 text-xs">{b.date}<div className="text-muted-foreground">{b.slot}</div></td>
                      <td className="p-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_COLORS[b.status] || "bg-muted"}`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="rounded-xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24 lg:self-start">
            {selected ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold">{selected.business}</h2>
                    <p className="text-xs text-muted-foreground">Submitted {new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                  <Badge className={STATUS_COLORS[selected.status]}>{selected.status}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="font-semibold">{selected.contact}</div>
                  <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Mail className="h-4 w-4" />{selected.email}</a>
                  <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Phone className="h-4 w-4" />{selected.phone}</a>
                  <div className="flex items-start gap-2 text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{selected.address}, {selected.postcode}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3 text-sm">
                  <div><div className="text-xs text-muted-foreground">Service</div>{selected.service}</div>
                  <div><div className="text-xs text-muted-foreground"><Calendar className="inline h-3 w-3" /> Date</div>{selected.date}</div>
                  <div className="col-span-2"><div className="text-xs text-muted-foreground"><Clock className="inline h-3 w-3" /> Slot</div>{selected.slot}</div>
                </div>

                {selected.notes && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</div>
                    <p className="mt-1 whitespace-pre-wrap text-sm">{selected.notes}</p>
                  </div>
                )}

                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Update status</div>
                  <div className="flex flex-wrap gap-2">
                    {["new", "confirmed", "completed", "cancelled"].map((s) => (
                      <Button key={s} size="sm" variant={selected.status === s ? "default" : "outline"}
                        onClick={() => updateStatus(selected.id, s)} className="capitalize">{s}</Button>
                    ))}
                  </div>
                </div>

                <Button variant="destructive" size="sm" className="w-full" onClick={() => deleteBooking(selected.id)}>
                  Delete booking
                </Button>
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Select a booking from the list to see full details.
              </div>
            )}
          </aside>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">← Back to site</Link>
      </p>
    </section>
  );
}
