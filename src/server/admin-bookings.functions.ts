import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const STATUSES = ["new", "confirmed", "completed", "cancelled"] as const;

function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD is not configured");
  if (password !== expected) throw new Error("Invalid password");
}

export const listBookings = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        password: z.string().min(1).max(200),
        search: z.string().max(120).optional().default(""),
        status: z.enum(["all", ...STATUSES]).optional().default("all"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    let q = supabaseAdmin
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (data.status !== "all") q = q.eq("status", data.status);
    if (data.search.trim()) {
      const s = data.search.trim().replace(/[%,]/g, "");
      q = q.or(
        `business.ilike.%${s}%,contact.ilike.%${s}%,email.ilike.%${s}%,phone.ilike.%${s}%,postcode.ilike.%${s}%`,
      );
    }
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const updateBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        password: z.string().min(1).max(200),
        id: z.string().uuid(),
        status: z.enum(STATUSES).optional(),
        admin_notes: z.string().max(2000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const patch: Record<string, unknown> = {};
    if (data.status) patch.status = data.status;
    if (typeof data.admin_notes === "string") patch.admin_notes = data.admin_notes;
    const { error } = await supabaseAdmin.from("bookings").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ password: z.string().min(1).max(200), id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { error } = await supabaseAdmin.from("bookings").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const verifyAdmin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    checkPassword(data.password);
    return { ok: true };
  });
