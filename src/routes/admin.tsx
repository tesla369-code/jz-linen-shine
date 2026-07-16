import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteAdminRecord,
  listAdminData,
  requireAdminProfile,
  signOut,
  updateBookingStatus,
  updateRequestStatus,
  type Booking,
  type BookingStatus,
  type ContactMessage,
  type Profile,
  type QuoteRequest,
  type RequestStatus,
} from "@/lib/supabase-data";
import { toast } from "sonner";
import { Search, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin - Bookings | JZ Linen" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Admin,
});

type AdminData = {
  bookings: Booking[];
  quotes: QuoteRequest[];
  contacts: ContactMessage[];
  profiles: Profile[];
};

type Tab = "bookings" | "quotes" | "contacts" | "profiles";

const bookingStatuses: BookingStatus[] = ["new", "confirmed", "completed", "cancelled"];
const requestStatuses: RequestStatus[] = ["new", "in_progress", "resolved", "archived"];

function Admin() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AdminData>({
    bookings: [],
    quotes: [],
    contacts: [],
    profiles: [],
  });
  const [tab, setTab] = useState<Tab>("bookings");
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const profile = await requireAdminProfile();
      if (!profile) {
        navigate({ to: "/admin/login" });
        return;
      }
      setAuthed(true);
      setData(await listAdminData());
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Could not load admin data";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filteredBookings = useFiltered(
    data.bookings,
    query,
    from,
    to,
    (b) =>
      `${b.business} ${b.contact} ${b.email} ${b.phone} ${b.service} ${b.postcode} ${b.address} ${b.notes ?? ""} ${b.status}`,
  );
  const filteredQuotes = useFiltered(
    data.quotes,
    query,
    from,
    to,
    (q) =>
      `${q.business} ${q.industry} ${q.contact} ${q.email} ${q.phone} ${q.city} ${q.volume} ${q.frequency} ${q.details ?? ""} ${q.status}`,
  );
  const filteredContacts = useFiltered(
    data.contacts,
    query,
    from,
    to,
    (c) => `${c.name} ${c.email} ${c.phone ?? ""} ${c.subject} ${c.message} ${c.status}`,
  );
  const filteredProfiles = useFiltered(
    data.profiles,
    query,
    from,
    to,
    (p) => `${p.name} ${p.email} ${p.phone ?? ""} ${p.role}`,
  );

  if (!authed && loading) return null;

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Supervisor dashboard"
        sub="Supabase-backed bookings, quote requests, messages and registered accounts."
      />
      <section className="container-page py-12">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {data.bookings.length} bookings - {data.quotes.length} quotes - {data.contacts.length}{" "}
            messages - {data.profiles.length} users
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void refresh()} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await signOut();
                toast.success("Signed out");
                navigate({ to: "/admin/login" });
              }}
            >
              Sign out
            </Button>
          </div>
        </div>

        <div className="mb-4 grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-card lg:grid-cols-[auto_1fr_auto_auto_auto]">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <TabButton tab={tab} value="bookings" label="Bookings" setTab={setTab} />
            <TabButton tab={tab} value="quotes" label="Quotes" setTab={setTab} />
            <TabButton tab={tab} value="contacts" label="Messages" setTab={setTab} />
            <TabButton tab={tab} value="profiles" label="Users" setTab={setTab} />
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search current view..."
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <DateField label="From" value={from} setValue={setFrom} />
          <DateField label="To" value={to} setValue={setTo} />
          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              setFrom("");
              setTo("");
            }}
          >
            Reset
          </Button>
        </div>

        {tab === "bookings" && <BookingsTable items={filteredBookings} refresh={refresh} />}
        {tab === "quotes" && <QuotesTable items={filteredQuotes} refresh={refresh} />}
        {tab === "contacts" && <ContactsTable items={filteredContacts} refresh={refresh} />}
        {tab === "profiles" && <ProfilesTable items={filteredProfiles} />}
      </section>
    </>
  );
}

function useFiltered<T extends { created_at: string }>(
  items: T[],
  query: string,
  from: string,
  to: string,
  toSearchText: (item: T) => string,
) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    const fromTs = from ? new Date(from + "T00:00:00").getTime() : null;
    const toTs = to ? new Date(to + "T23:59:59").getTime() : null;

    return items.filter((item) => {
      if (q && !toSearchText(item).toLowerCase().includes(q)) return false;
      const ts = new Date(item.created_at).getTime();
      if (fromTs !== null && ts < fromTs) return false;
      if (toTs !== null && ts > toTs) return false;
      return true;
    });
  }, [items, query, from, to, toSearchText]);
}

function TabButton({
  tab,
  value,
  label,
  setTab,
}: {
  tab: Tab;
  value: Tab;
  label: string;
  setTab: (tab: Tab) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => setTab(value)}
      className={`h-10 rounded-md px-3 text-sm font-medium transition-colors ${tab === value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}
    >
      {label}
    </button>
  );
}

function DateField({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
      No {label} found.
    </div>
  );
}

function BookingsTable({ items, refresh }: { items: Booking[]; refresh: () => Promise<void> }) {
  if (items.length === 0) return <EmptyState label="bookings" />;
  return (
    <DataShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Received</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {formatDate(b.created_at)}
              </TableCell>
              <TableCell>
                <StatusSelect
                  value={b.status}
                  options={bookingStatuses}
                  onChange={async (status) => {
                    await updateBookingStatus(b.id, status as BookingStatus);
                    await refresh();
                  }}
                />
              </TableCell>
              <TableCell className="font-medium">{b.business}</TableCell>
              <TableCell>{b.contact}</TableCell>
              <TableCell>
                <a className="text-primary hover:underline" href={`mailto:${b.email}`}>
                  {b.email}
                </a>
              </TableCell>
              <TableCell>
                <a className="text-primary hover:underline" href={`tel:${b.phone}`}>
                  {b.phone}
                </a>
              </TableCell>
              <TableCell>{b.service}</TableCell>
              <TableCell className="whitespace-nowrap">
                {b.date}
                <br />
                <span className="text-xs text-muted-foreground">{b.slot}</span>
              </TableCell>
              <TableCell className="max-w-[220px] text-xs">
                {b.postcode} - {b.address}
              </TableCell>
              <TableCell className="max-w-[220px] text-xs text-muted-foreground">
                {b.notes || "-"}
              </TableCell>
              <DeleteCell table="bookings" id={b.id} refresh={refresh} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataShell>
  );
}

function QuotesTable({ items, refresh }: { items: QuoteRequest[]; refresh: () => Promise<void> }) {
  if (items.length === 0) return <EmptyState label="quote requests" />;
  return (
    <DataShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Received</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Need</TableHead>
            <TableHead>Details</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((q) => (
            <TableRow key={q.id}>
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {formatDate(q.created_at)}
              </TableCell>
              <TableCell>
                <RequestStatusSelect
                  table="quote_requests"
                  id={q.id}
                  value={q.status}
                  refresh={refresh}
                />
              </TableCell>
              <TableCell className="font-medium">
                {q.business}
                <br />
                <span className="text-xs text-muted-foreground">{q.industry}</span>
              </TableCell>
              <TableCell>
                {q.contact}
                {q.role ? (
                  <span className="block text-xs text-muted-foreground">{q.role}</span>
                ) : null}
              </TableCell>
              <TableCell>
                <a className="text-primary hover:underline" href={`mailto:${q.email}`}>
                  {q.email}
                </a>
              </TableCell>
              <TableCell>
                <a className="text-primary hover:underline" href={`tel:${q.phone}`}>
                  {q.phone}
                </a>
              </TableCell>
              <TableCell className="text-xs">
                {q.city}
                <br />
                {q.volume}
                <br />
                {q.frequency}
              </TableCell>
              <TableCell className="max-w-[260px] text-xs text-muted-foreground">
                {q.details || q.rooms || "-"}
              </TableCell>
              <DeleteCell table="quote_requests" id={q.id} refresh={refresh} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataShell>
  );
}

function ContactsTable({
  items,
  refresh,
}: {
  items: ContactMessage[];
  refresh: () => Promise<void>;
}) {
  if (items.length === 0) return <EmptyState label="messages" />;
  return (
    <DataShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Received</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {formatDate(m.created_at)}
              </TableCell>
              <TableCell>
                <RequestStatusSelect
                  table="contact_messages"
                  id={m.id}
                  value={m.status}
                  refresh={refresh}
                />
              </TableCell>
              <TableCell className="font-medium">{m.name}</TableCell>
              <TableCell>
                <a className="text-primary hover:underline" href={`mailto:${m.email}`}>
                  {m.email}
                </a>
              </TableCell>
              <TableCell>
                {m.phone ? (
                  <a className="text-primary hover:underline" href={`tel:${m.phone}`}>
                    {m.phone}
                  </a>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>{m.subject}</TableCell>
              <TableCell className="max-w-[340px] text-xs text-muted-foreground">
                {m.message}
              </TableCell>
              <DeleteCell table="contact_messages" id={m.id} refresh={refresh} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataShell>
  );
}

function ProfilesTable({ items }: { items: Profile[] }) {
  if (items.length === 0) return <EmptyState label="users" />;
  return (
    <DataShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Joined</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {formatDate(p.created_at)}
              </TableCell>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>
                <a className="text-primary hover:underline" href={`mailto:${p.email}`}>
                  {p.email}
                </a>
              </TableCell>
              <TableCell>
                {p.phone ? (
                  <a className="text-primary hover:underline" href={`tel:${p.phone}`}>
                    {p.phone}
                  </a>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="capitalize">{p.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataShell>
  );
}

function DataShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
      {children}
    </div>
  );
}

function StatusSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => Promise<void>;
}) {
  return (
    <select
      value={value}
      onChange={async (e) => {
        try {
          await onChange(e.target.value);
          toast.success("Status updated");
        } catch (err) {
          const message = err instanceof Error ? err.message : "Could not update status";
          toast.error(message);
        }
      }}
      className="h-9 rounded-md border border-input bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}

function RequestStatusSelect({
  table,
  id,
  value,
  refresh,
}: {
  table: "quote_requests" | "contact_messages";
  id: string;
  value: RequestStatus;
  refresh: () => Promise<void>;
}) {
  return (
    <StatusSelect
      value={value}
      options={requestStatuses}
      onChange={async (status) => {
        await updateRequestStatus(table, id, status as RequestStatus);
        await refresh();
      }}
    />
  );
}

function DeleteCell({
  table,
  id,
  refresh,
}: {
  table: "bookings" | "quote_requests" | "contact_messages";
  id: string;
  refresh: () => Promise<void>;
}) {
  return (
    <TableCell>
      <Button
        size="icon"
        variant="ghost"
        onClick={async () => {
          if (!confirm("Delete this record?")) return;
          try {
            await deleteAdminRecord(table, id);
            toast.success("Record deleted");
            await refresh();
          } catch (err) {
            const message = err instanceof Error ? err.message : "Could not delete record";
            toast.error(message);
          }
        }}
        aria-label="Delete record"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </TableCell>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}
