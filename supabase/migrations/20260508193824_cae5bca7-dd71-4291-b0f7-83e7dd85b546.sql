CREATE POLICY "Authenticated can view bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can delete bookings"
  ON public.bookings FOR DELETE
  TO authenticated
  USING (true);