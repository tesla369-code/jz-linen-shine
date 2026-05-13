import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
  getBookings,
  deleteBooking,
  clearBookings,
  type StoredBooking,
} from "@/lib/bookings-store";
import {
  clearAdminSession,
  clearUsers,
  deleteUser,
  getUsers,
  hasAdminSession,
  type StoredUser,
} from "@/lib/local-users-store";
import { toast } from "sonner";
import { Trash2, Search } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin - Bookings | JZ Linen" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<StoredBooking[]>([]);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasAdminSession()) {
      setAuthed(true);
    } else {
      navigate({ to: "/admin/login" });
    }
  }, [navigate]);

  const refresh = () => {
    setItems(getBookings());
    setUsers(getUsers());
  };

  useEffect(() => {
    if (authed) refresh();
  }, [authed]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const fromTs = from ? new Date(from + "T00:00:00").getTime() : null;
    const toTs = to ? new Date(to + "T23:59:59").getTime() : null;
    return items.filter((b) => {
      if (q) {
        const hay =
          `${b.business} ${b.contact} ${b.email} ${b.phone} ${b.service} ${b.postcode} ${b.address} ${b.notes ?? ""}`.toLowerCase();
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

  useEffect(() => {
    setPage(1);
  }, [query, from, to]);

  if (!authed) {
    return null;
  }

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Customer bookings"
        sub="Local-storage only. Data is visible on this device/browser."
      />
      <section className="container-page py-12">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {filtered.length} of {items.length} booking{items.length === 1 ? "" : "s"} -{" "}
            {users.length} user{users.length === 1 ? "" : "s"}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={refresh}>
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                clearAdminSession();
                toast.success("Signed out");
                navigate({ to: "/admin/login" });
              }}
            >
              Sign out
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("Clear all bookings from this browser?")) {
                  clearBookings();
                  refresh();
                }
              }}
            >
              Clear bookings
            </Button>
          </div>
        </div>

        <div className="mb-4 grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-card sm:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search business, contact, email, phone, service, address..."
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
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

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            {items.length === 0
              ? "No bookings yet. New pickup requests will appear here."
              : "No bookings match your filters."}
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
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {new Date(b.createdAt).toLocaleString()}
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
                      <TableCell>{b.date}</TableCell>
                      <TableCell>{b.slot}</TableCell>
                      <TableCell className="max-w-[220px] text-xs">
                        {b.postcode} - {b.address}
                      </TableCell>
                      <TableCell className="max-w-[220px] text-xs text-muted-foreground">
                        {b.notes || "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            deleteBooking(b.id);
                            refresh();
                          }}
                          aria-label="Delete booking"
                        >
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
                Page {currentPage} of {totalPages} - Showing {pageItems.length} of {filtered.length}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">Registered users</h2>
            <p className="text-sm text-muted-foreground">
              Local signups from the Login / Sign Up page.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Clear all registered users from this browser?")) {
                clearUsers();
                refresh();
              }
            }}
          >
            Clear users
          </Button>
        </div>

        {users.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            No registered users yet. New signups will appear here.
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-border bg-card shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Joined</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Last login</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <a className="text-primary hover:underline" href={`mailto:${user.email}`}>
                        {user.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      {user.phone ? (
                        <a className="text-primary hover:underline" href={`tel:${user.phone}`}>
                          {user.phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{user.password}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          deleteUser(user.id);
                          refresh();
                        }}
                        aria-label="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </>
  );
}
