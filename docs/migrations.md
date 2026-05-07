# Running Supabase migrations safely

Your schema lives in `supabase/migrations/*.sql`. Each file is applied **once, in
filename order**, against the hosted Postgres database. The admin bookings page
depends on the `bookings` table and `booking_status` enum defined there — so
breaking those breaks `/admin/bookings`.

## TL;DR — Safest workflow (recommended)

**Make schema changes through Lovable, edit app code anywhere.**

1. In Lovable chat, describe the schema change ("add a `priority` column to
   bookings").
2. Lovable proposes a migration file → you approve → it runs against the cloud DB
   and regenerates `src/integrations/supabase/types.ts`.
3. `git pull` in VS Code to get the new migration + updated types.
4. Update app code locally, push back — done.

This avoids type drift and keeps one source of truth for the schema.

---

## Option A — Run migrations locally against the cloud DB (Supabase CLI)

Use this if you want to author migrations from VS Code.

### One-time setup

```bash
# Install the CLI
brew install supabase/tap/supabase   # macOS
# or: scoop install supabase         # Windows
# or: npm i -g supabase              # any OS

# From the project root, link to the cloud project
supabase login
supabase link --project-ref upibokvyfccvzvnddexg
```

It will prompt for the database password (Lovable → Cloud → Settings → Database).

### Create + apply a migration

```bash
# 1. Scaffold a new timestamped file in supabase/migrations/
supabase migration new add_priority_to_bookings

# 2. Edit the generated SQL file. Example:
#    ALTER TABLE public.bookings ADD COLUMN priority text;

# 3. Dry-run against the cloud DB
supabase db push --dry-run

# 4. Apply for real
supabase db push

# 5. Regenerate TypeScript types so the app compiles
supabase gen types typescript --linked > src/integrations/supabase/types.ts
```

Commit the migration file **and** the regenerated `types.ts` together.

### Optional: full local Postgres for risky experiments

```bash
supabase start          # spins up local Postgres on :54322
supabase db reset       # replays every migration into the local DB
# point .env at the local URL while you test, then revert
supabase stop
```

This lets you test destructive changes (drops, renames) without touching prod.

---

## Rules to avoid breaking `/admin/bookings`

1. **Never edit an old migration file.** Always add a new timestamped one. Old
   files are immutable history — editing them desyncs local vs cloud.
2. **Don't drop or rename these without updating code in the same PR:**
   - table `public.bookings`
   - enum `public.booking_status` and its values (`new`, `confirmed`,
     `completed`, `cancelled`)
   - columns read by `src/server/admin-bookings.functions.ts` and
     `src/routes/admin.bookings.tsx` (`business`, `contact`, `email`, `phone`,
     `postcode`, `address`, `service`, `date`, `slot`, `notes`, `status`,
     `admin_notes`, `created_at`, `updated_at`).
3. **Additive changes are safe** (new nullable columns, new enum values, new
   indexes). Removals/renames are not — do them in two steps:
   add new → migrate code → drop old in a later migration.
4. **Always regenerate `types.ts`** after a migration. Stale types are the #1
   cause of "works in dev, breaks on build".
5. **Keep RLS intact.** The public form relies on the `anyone can insert
   bookings` policy; the admin page relies on `supabaseAdmin` bypassing RLS.
   Don't add restrictive `SELECT/UPDATE/DELETE` policies for `anon` — instead,
   keep those operations server-side.
6. **Test locally before pushing**: `bun run dev`, submit a booking on
   `/book-pickup`, then open `/admin/bookings` and confirm it appears, you can
   change status, and delete works.

---

## Rollback

There is no automatic `down` migration. If a change breaks production:

- Write a new forward migration that reverses it (e.g.
  `ALTER TABLE ... DROP COLUMN priority;`), or
- Use Lovable's chat **Revert** to roll the project back to the version before
  the migration, then ask Lovable to run a compensating migration.

Never delete a migration file from `supabase/migrations/` after it has been
applied to the cloud DB.