import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const OWNER_EMAIL = "moin75678@gmail.com";

const bookingSchema = z.object({
  business: z.string().trim().min(2).max(120),
  contact: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  postcode: z.string().trim().min(3).max(10),
  address: z.string().trim().min(5).max(255),
  service: z.string().min(1).max(80),
  date: z.string().min(1).max(20),
  slot: z.string().min(1).max(80),
  notes: z.string().max(600).optional().default(""),
});

function b64url(input: string) {
  return Buffer.from(input, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function buildRaw(to: string, subject: string, html: string, replyTo?: string) {
  const headers = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
  ];
  if (replyTo) headers.push(`Reply-To: ${replyTo}`);
  return b64url(headers.join("\r\n") + "\r\n\r\n" + html);
}

async function sendGmail(raw: string) {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const GOOGLE_MAIL_API_KEY = process.env.GOOGLE_MAIL_API_KEY;
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
  if (!GOOGLE_MAIL_API_KEY) throw new Error("GOOGLE_MAIL_API_KEY is not configured");

  const res = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GOOGLE_MAIL_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Gmail send failed [${res.status}]: ${JSON.stringify(data)}`);
  }
  return data;
}

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    // Persist booking to database
    const { error: dbError } = await supabaseAdmin.from("bookings").insert({
      business: data.business,
      contact: data.contact,
      email: data.email,
      phone: data.phone,
      postcode: data.postcode,
      address: data.address,
      service: data.service,
      date: data.date,
      slot: data.slot,
      notes: data.notes || null,
    });
    if (dbError) console.error("[booking] DB insert failed:", dbError);

    const rows = [
      ["Business", data.business],
      ["Contact", data.contact],
      ["Email", data.email],
      ["Phone", data.phone],
      ["Service", data.service],
      ["Date", data.date],
      ["Slot", data.slot],
      ["Postcode", data.postcode],
      ["Address", data.address],
      ["Notes", data.notes || "—"],
    ];
    const tableRows = rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px;border:1px solid #eee;font-weight:600;background:#fafafa">${k}</td><td style="padding:6px 12px;border:1px solid #eee">${String(v).replace(/</g, "&lt;")}</td></tr>`,
      )
      .join("");

    const ownerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:640px">
        <h2 style="color:#0f172a">New Pickup Booking</h2>
        <p>You have a new linen pickup request from <strong>${data.business}</strong>.</p>
        <table style="border-collapse:collapse;width:100%;font-size:14px">${tableRows}</table>
        <p style="margin-top:16px;color:#475569;font-size:12px">Reply directly to this email to contact the customer.</p>
      </div>`;

    const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:640px">
        <h2 style="color:#0f172a">Thanks, ${data.contact} — we've got your booking</h2>
        <p>We've received your pickup request for <strong>${data.business}</strong>. Our team will confirm by email or phone within 30 minutes during working hours.</p>
        <h3 style="margin-top:24px">Your details</h3>
        <table style="border-collapse:collapse;width:100%;font-size:14px">${tableRows}</table>
        <p style="margin-top:24px">— JZ Linen &amp; Laundry</p>
      </div>`;

    await sendGmail(
      buildRaw(OWNER_EMAIL, `New pickup booking — ${data.business} (${data.date})`, ownerHtml, data.email),
    );
    await sendGmail(
      buildRaw(data.email, "Your JZ Linen pickup request", customerHtml),
    );

    return { ok: true };
  });