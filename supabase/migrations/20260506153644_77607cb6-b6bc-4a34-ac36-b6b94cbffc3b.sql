
CREATE TYPE public.booking_status AS ENUM ('new','confirmed','completed','cancelled');

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business text NOT NULL,
  contact text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  postcode text NOT NULL,
  address text NOT NULL,
  service text NOT NULL,
  date text NOT NULL,
  slot text NOT NULL,
  notes text,
  status public.booking_status NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX bookings_created_at_idx ON public.bookings (created_at DESC);
CREATE INDEX bookings_status_idx ON public.bookings (status);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can insert a booking from the public form
CREATE POLICY "anyone can insert bookings"
ON public.bookings FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policies: only the service role (server) can read/modify.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER bookings_set_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
