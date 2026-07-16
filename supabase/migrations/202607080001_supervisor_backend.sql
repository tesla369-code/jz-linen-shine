create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'user');
  end if;

  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type public.booking_status as enum ('new', 'confirmed', 'completed', 'cancelled');
  end if;

  if not exists (select 1 from pg_type where typname = 'request_status') then
    create type public.request_status as enum ('new', 'in_progress', 'resolved', 'archived');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  phone text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  business text not null,
  contact text not null,
  email text not null,
  phone text not null,
  postcode text not null,
  address text not null,
  service text not null,
  date date not null,
  slot text not null,
  notes text,
  admin_notes text,
  status public.booking_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  business text not null,
  industry text not null,
  contact text not null,
  role text,
  email text not null,
  phone text not null,
  city text not null,
  rooms text,
  volume text not null,
  frequency text not null,
  details text,
  status public.request_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status public.request_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    'user'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;

create trigger on_auth_user_created_profile
after insert on auth.users
for each row
execute function public.handle_new_user_profile();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_profiles_updated_at on public.profiles;
create trigger touch_profiles_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists touch_bookings_updated_at on public.bookings;
create trigger touch_bookings_updated_at
before update on public.bookings
for each row execute function public.touch_updated_at();

drop trigger if exists touch_quote_requests_updated_at on public.quote_requests;
create trigger touch_quote_requests_updated_at
before update on public.quote_requests
for each row execute function public.touch_updated_at();

drop trigger if exists touch_contact_messages_updated_at on public.contact_messages;
create trigger touch_contact_messages_updated_at
before update on public.contact_messages
for each row execute function public.touch_updated_at();

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = _user_id
      and role = _role
  )
  or exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(auth.uid(), 'admin');
$$;

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.quote_requests enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Profiles can be inserted by owner" on public.profiles;
create policy "Profiles can be inserted by owner"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Profiles can be read by owner or admin" on public.profiles;
create policy "Profiles can be read by owner or admin"
on public.profiles for select
to authenticated
using (auth.uid() = id or public.is_admin());

drop policy if exists "Profiles can be updated by owner or admin" on public.profiles;
create policy "Profiles can be updated by owner or admin"
on public.profiles for update
to authenticated
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "Public can create bookings" on public.bookings;
create policy "Public can create bookings"
on public.bookings for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can manage bookings" on public.bookings;
create policy "Admins can manage bookings"
on public.bookings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can create quote requests" on public.quote_requests;
create policy "Public can create quote requests"
on public.quote_requests for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can manage quote requests" on public.quote_requests;
create policy "Admins can manage quote requests"
on public.quote_requests for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can create contact messages" on public.contact_messages;
create policy "Public can create contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can manage contact messages" on public.contact_messages;
create policy "Admins can manage contact messages"
on public.contact_messages for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists quote_requests_created_at_idx on public.quote_requests (created_at desc);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists profiles_role_idx on public.profiles (role);

-- Make your account admin
update public.profiles
set role = 'admin',
    updated_at = now()
where lower(email) = lower('JZLINENLAUNDRY@Gmail.com');

insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where lower(email) = lower('JZLINENLAUNDRY@Gmail.com')
on conflict (user_id, role) do nothing;