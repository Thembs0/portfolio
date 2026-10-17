-- Thembinkosi Ndlovu portfolio: Supabase schema
-- Run this whole file in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null,
  description text not null default '',
  role text not null default '',
  technologies text[] not null default '{}',
  category text not null default 'Web application',
  github_url text,
  live_url text,
  cover_image text,
  gallery text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default 'Portfolio enquiry',
  message text not null,
  status text not null default 'new' check (status in ('new','read','replied','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organisation text not null default '',
  service text not null,
  preferred_date date,
  preferred_time text,
  details text not null default '',
  status text not null default 'new' check (status in ('new','contacted','confirmed','completed','cancelled')),
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.messages enable row level security;
alter table public.bookings enable row level security;

-- Public visitors can only read published projects.
drop policy if exists "Public can view published projects" on public.projects;
create policy "Public can view published projects" on public.projects
  for select to anon, authenticated using (published = true);

-- Authenticated project management. Admin access is granted only to the account
-- you create for yourself in Supabase. Do not expose the service-role key in the frontend.
drop policy if exists "Authenticated users manage projects" on public.projects;
create policy "Authenticated users manage projects" on public.projects
  for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

-- Public forms may create enquiries. They cannot read, edit or delete any enquiry.
drop policy if exists "Visitors can submit messages" on public.messages;
create policy "Visitors can submit messages" on public.messages
  for insert to anon, authenticated with check (
    length(trim(name)) between 1 and 100 and
    length(trim(email)) between 3 and 200 and
    length(trim(message)) between 1 and 5000
  );
drop policy if exists "Authenticated users manage messages" on public.messages;
create policy "Authenticated users manage messages" on public.messages
  for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "Visitors can request bookings" on public.bookings;
create policy "Visitors can request bookings" on public.bookings
  for insert to anon, authenticated with check (
    length(trim(name)) between 1 and 100 and
    length(trim(email)) between 3 and 200 and
    length(trim(service)) between 1 and 200 and
    length(trim(details)) <= 4000
  );
drop policy if exists "Authenticated users manage bookings" on public.bookings;
create policy "Authenticated users manage bookings" on public.bookings
  for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

-- Storage bucket for project screenshots. Public read is needed to display images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', true, 8388608, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 8388608,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif'];

drop policy if exists "Anyone can view project images" on storage.objects;
create policy "Anyone can view project images" on storage.objects
  for select to anon, authenticated using (bucket_id = 'project-images');

drop policy if exists "Authenticated users upload project images" on storage.objects;
create policy "Authenticated users upload project images" on storage.objects
  for insert to authenticated with check (bucket_id = 'project-images');

drop policy if exists "Authenticated users update project images" on storage.objects;
create policy "Authenticated users update project images" on storage.objects
  for update to authenticated using (bucket_id = 'project-images') with check (bucket_id = 'project-images');

drop policy if exists "Authenticated users delete project images" on storage.objects;
create policy "Authenticated users delete project images" on storage.objects
  for delete to authenticated using (bucket_id = 'project-images');

-- No public SELECT policies exist for messages or bookings. Do not add them.
