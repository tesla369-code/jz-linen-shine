import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, RefreshCw, Search, LogOut, Trash2 } from "lucide-react";
import {
  listBookings,
  updateBooking,
  deleteBooking,
  verifyAdmin,
} from "@/server/admin-bookings.functions";

export const Route = createFileRoute("/admin/bookings")({
  head: () => ({
    meta: [
      { title: "Bookings Admin — JZ Linen" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminBookings,
});

const STATUS_OPTIONS = ["new", "confirmed", "completed", "cancelled"] as const;
type Status = (typeof STATUS_OPTIONS)[number];

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
  status: Status;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

const STORAGE_KEY = "jz_admin_pw";

function statusColor(s: Status) {
  switch (s) {
    case "new":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "confirmed":
      return "bg-amber-100 text-amber-900 hover:bg-amber-100";
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
  }
}

function AdminBookings() {
  const [password, setPassword] = useState<string | null>(null);
  const [pwInput, setPwInput] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    if (stored) setPassword(stored);
  }, []);

  if (!password) {
    return (
      <section className="container-page flex min-h-[70vh] items-center justify-center py-20">
        <form
          className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-card"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!pwInput) return;
            setVerifying(true);
            try {
              await verifyAdmin({ data: { password: pwInput } });
              sessionStorage.setItem(STORAGE_KEY, pwInput);
              setPassword(pwInput);
            } catch {
              toast.error("Invalid password");
            } finally {
              setVerifying(false);
            }
          }}
        >
          <h1 className="font-display text-2xl font-bold">Admin access</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the admin password to view bookings.
          </p>
          <Input
            type="password"
            className="mt-6"
            placeholder="Password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            autoFocus
          />
          <Button type="submit" className="mt-4 w-full" disabled={verifying}>
            {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>
      </section>
    );
  }

  return <BookingsDashboard password={password} onLogout={() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setPassword(null);
    setPwInput("");
  }} />;
}

function BookingsDashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [editing, setEditing] = useState<Booking | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await listBookings({
        data: { password, search, status: statusFilter },
      });
      setRows(res.rows as Booking[]);
    } catch (e) {
      toast.error((e as Error).message || "Failed to load bookings");
      if ((e as Error).message === "Invalid password") onLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const s of STATUS_OPTIONS) c[s] = 0;
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  return (
    <section className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Bookings</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading…" : `${rows.length} ${rows.length === 1 ? "booking" : "bookings"}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <form
          className="relative flex-1 min-w-[240px]"
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search business, name, email, phone, postcode…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </form>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | Status)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses ({counts.all ?? 0})</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s} ({counts[s] ?? 0})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Business / Contact</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Pickup</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No bookings found.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 align-top">
                  <div className="font-medium">{new Date(r.created_at).toLocaleDateString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="font-semibold">{r.business}</div>
                  <div className="text-xs text-muted-foreground">{r.contact}</div>
                  <div className="text-xs"><a className="text-primary hover:underline" href={`mailto:${r.email}`}>{r.email}</a></div>
                  <div className="text-xs"><a className="text-primary hover:underline" href={`tel:${r.phone}`}>{r.phone}</a></div>
                </td>
                <td className="px-4 py-3 align-top">{r.service}</td>
                <td className="px-4 py-3 align-top">
                  <div>{r.date}</div>
                  <div className="text-xs text-muted-foreground">{r.slot}</div>
                  <div className="text-xs text-muted-foreground">{r.postcode}</div>
                </td>
                <td className="px-4 py-3 align-top">
                  <Badge className={statusColor(r.status)} variant="secondary">{r.status}</Badge>
                </td>
                <td className="px-4 py-3 align-top text-right">
                  <Button size="sm" variant="outline" onClick={() => setEditing(r)}>
                    Open
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditDialog
        booking={editing}
        password={password}
        onClose={() => setEditing(null)}
        onChanged={load}
      />
    </section>
  );
}

function EditDialog({
  booking,
  password,
  onClose,
  onChanged,
}: {
  booking: Booking | null;
  password: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [status, setStatus] = useState<Status>("new");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (booking) {
      setStatus(booking.status);
      setAdminNotes(booking.admin_notes ?? "");
    }
  }, [booking]);

  if (!booking) return null;

  const save = async () => {
    setSaving(true);
    try {
      await updateBooking({ data: { password, id: booking.id, status, admin_notes: adminNotes } });
      toast.success("Booking updated");
      onChanged();
      onClose();
    } catch (e) {
      toast.error((e as Error).message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete this booking permanently?")) return;
    setDeleting(true);
    try {
      await deleteBooking({ data: { password, id: booking.id } });
      toast.success("Booking deleted");
      onChanged();
      onClose();
    } catch (e) {
      toast.error((e as Error).message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={!!booking} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{booking.business}</DialogTitle>
          <DialogDescription>
            Submitted {new Date(booking.created_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <Info label="Contact" value={booking.contact} />
          <Info label="Email" value={booking.email} />
          <Info label="Phone" value={booking.phone} />
          <Info label="Service" value={booking.service} />
          <Info label="Preferred date" value={booking.date} />
          <Info label="Time slot" value={booking.slot} />
          <Info label="Postcode" value={booking.postcode} />
          <Info label="Address" value={booking.address} />
        </div>

        {booking.notes && (
          <div>
            <div className="text-xs font-medium uppercase text-muted-foreground">Customer notes</div>
            <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted/40 p-3 text-sm">{booking.notes}</p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Internal notes</label>
            <Textarea
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Notes only visible to staff"
            />
          </div>
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button variant="ghost" className="text-destructive" onClick={remove} disabled={deleting}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm">{value}</div>
    </div>
  );
}
