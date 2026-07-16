import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Booking = Tables<"bookings">;
export type QuoteRequest = Tables<"quote_requests">;
export type ContactMessage = Tables<"contact_messages">;
export type Profile = Tables<"profiles">;
export type BookingStatus = Database["public"]["Enums"]["booking_status"];
export type RequestStatus = Database["public"]["Enums"]["request_status"];

export type PublicBookingInput = Pick<
  TablesInsert<"bookings">,
  | "business"
  | "contact"
  | "email"
  | "phone"
  | "postcode"
  | "address"
  | "service"
  | "date"
  | "slot"
  | "notes"
>;

export type PublicQuoteInput = Pick<
  TablesInsert<"quote_requests">,
  | "business"
  | "industry"
  | "contact"
  | "role"
  | "email"
  | "phone"
  | "city"
  | "rooms"
  | "volume"
  | "frequency"
  | "details"
>;

export type PublicContactInput = Pick<
  TablesInsert<"contact_messages">,
  "name" | "email" | "phone" | "subject" | "message"
>;

const publicBookingSchema = z.object({
  business: z.string().trim().min(2).max(120),
  contact: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  postcode: z.string().trim().min(5).max(10),
  address: z.string().trim().min(5).max(255),
  service: z.string().min(1),
  date: z.string().min(1),
  slot: z.string().min(1),
  notes: z.string().max(600).optional(),
});

const publicQuoteSchema = z.object({
  business: z.string().trim().min(2).max(120),
  industry: z.string().min(1),
  contact: z.string().trim().min(2).max(80),
  role: z.string().trim().max(80).optional(),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  city: z.string().trim().min(2).max(80),
  rooms: z.string().trim().max(20).optional(),
  volume: z.string().min(1),
  frequency: z.string().min(1),
  details: z.string().trim().max(1000).optional(),
});

const publicContactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(1000),
});

const accessTokenSchema = z.object({
  accessToken: z.string().min(1),
});

const deleteRecordSchema = accessTokenSchema.extend({
  table: z.enum(["bookings", "quote_requests", "contact_messages"]),
  id: z.string().uuid(),
});

const bookingStatusSchema = accessTokenSchema.extend({
  id: z.string().uuid(),
  status: z.enum(["new", "confirmed", "completed", "cancelled"]),
});

const requestStatusSchema = accessTokenSchema.extend({
  table: z.enum(["quote_requests", "contact_messages"]),
  id: z.string().uuid(),
  status: z.enum(["new", "in_progress", "resolved", "archived"]),
});

function emptyToNull<T extends Record<string, unknown>>(input: T) {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, value === "" ? null : value]),
  ) as T;
}

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session?.access_token ?? null;
}

async function requireAdmin(accessToken: string) {
  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
  if (userError || !userData.user) throw new Error("Not authenticated");

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (profileError) throw profileError;

  if (profile?.role === "admin") return profile;

  const { data: roles, error: roleError } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin");
  if (roleError) throw roleError;

  if ((roles?.length ?? 0) === 0) throw new Error("Admin access required");
  return profile;
}

const createBookingServer = createServerFn({ method: "POST" })
  .inputValidator(publicBookingSchema)
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("bookings").insert(emptyToNull(data));
    if (error) throw error;
  });

const createQuoteRequestServer = createServerFn({ method: "POST" })
  .inputValidator(publicQuoteSchema)
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("quote_requests").insert(emptyToNull(data));
    if (error) throw error;
  });

const createContactMessageServer = createServerFn({ method: "POST" })
  .inputValidator(publicContactSchema)
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("contact_messages").insert(emptyToNull(data));
    if (error) throw error;
  });

const getCurrentProfileServer = createServerFn({ method: "POST" })
  .inputValidator(accessTokenSchema)
  .handler(async ({ data }) => {
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(data.accessToken);
    if (userError || !userData.user) return null;

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .maybeSingle();
    if (error) throw error;
    return profile;
  });

const requireAdminProfileServer = createServerFn({ method: "POST" })
  .inputValidator(accessTokenSchema)
  .handler(async ({ data }) => requireAdmin(data.accessToken));

const listAdminDataServer = createServerFn({ method: "POST" })
  .inputValidator(accessTokenSchema)
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);

    const [bookings, quotes, contacts, profiles] = await Promise.all([
      supabaseAdmin.from("bookings").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("quote_requests").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("contact_messages").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("profiles").select("*").order("created_at", { ascending: false }),
    ]);

    if (bookings.error) throw bookings.error;
    if (quotes.error) throw quotes.error;
    if (contacts.error) throw contacts.error;
    if (profiles.error) throw profiles.error;

    return {
      bookings: bookings.data ?? [],
      quotes: quotes.data ?? [],
      contacts: contacts.data ?? [],
      profiles: profiles.data ?? [],
    };
  });

const deleteAdminRecordServer = createServerFn({ method: "POST" })
  .inputValidator(deleteRecordSchema)
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);
    const { error } = await supabaseAdmin.from(data.table).delete().eq("id", data.id);
    if (error) throw error;
  });

const updateBookingStatusServer = createServerFn({ method: "POST" })
  .inputValidator(bookingStatusSchema)
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);
    const update: TablesUpdate<"bookings"> = { status: data.status };
    const { error } = await supabaseAdmin.from("bookings").update(update).eq("id", data.id);
    if (error) throw error;
  });

const updateRequestStatusServer = createServerFn({ method: "POST" })
  .inputValidator(requestStatusSchema)
  .handler(async ({ data }) => {
    await requireAdmin(data.accessToken);
    const update = { status: data.status };
    const { error } = await supabaseAdmin.from(data.table).update(update).eq("id", data.id);
    if (error) throw error;
  });

export async function createBooking(input: PublicBookingInput) {
  await createBookingServer({ data: input });
}

export async function createQuoteRequest(input: PublicQuoteInput) {
  await createQuoteRequestServer({ data: input });
}

export async function createContactMessage(input: PublicContactInput) {
  await createContactMessageServer({ data: input });
}

export async function signUpWithProfile(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        phone: input.phone || null,
      },
    },
  });
  if (error) throw error;
  if (!data.user) throw new Error("Signup did not return a user.");

  if (data.session) {
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone || null,
      role: "user",
    });
    if (profileError) throw profileError;
  }

  return data.user;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentProfile() {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;
  return getCurrentProfileServer({ data: { accessToken } });
}

export async function requireAdminProfile() {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    return await requireAdminProfileServer({ data: { accessToken } });
  } catch {
    return null;
  }
}

export async function listAdminData() {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("Not authenticated");
  return listAdminDataServer({ data: { accessToken } });
}

export async function deleteAdminRecord(
  table: "bookings" | "quote_requests" | "contact_messages",
  id: string,
) {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("Not authenticated");
  await deleteAdminRecordServer({ data: { accessToken, table, id } });
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("Not authenticated");
  await updateBookingStatusServer({ data: { accessToken, id, status } });
}

export async function updateRequestStatus(
  table: "quote_requests" | "contact_messages",
  id: string,
  status: RequestStatus,
) {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("Not authenticated");
  await updateRequestStatusServer({ data: { accessToken, table, id, status } });
}
