create extension if not exists pgcrypto;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  industry text,
  location text,
  logo_url text,
  brand_color text,
  notes text,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete restrict,
  category text not null,
  document_type text not null,
  status text not null check (status in ('Active','Draft','Needs Review','Expired','Archived')),
  title text not null,
  notes text,
  tags text[] not null default '{}',
  file_url text not null,
  original_file_name text not null,
  stored_file_name text not null,
  file_extension text not null,
  mime_type text not null,
  file_size bigint not null,
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_activity (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  document_id uuid references public.documents(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  description text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_businesses_workspace_archived on public.businesses(workspace_id, archived);
create index if not exists idx_documents_workspace_business_archived on public.documents(workspace_id, business_id, archived);
create index if not exists idx_documents_status_category on public.documents(status, category);
create index if not exists idx_documents_tags_gin on public.documents using gin(tags);
create index if not exists idx_documents_search_trgm on public.documents using gin ((coalesce(title,'') || ' ' || coalesce(original_file_name,'') || ' ' || coalesce(notes,'') || ' ' || coalesce(category,'')) gin_trgm_ops);
create index if not exists idx_activity_workspace_created on public.document_activity(workspace_id, created_at desc);

alter table public.workspaces enable row level security;
alter table public.businesses enable row level security;
alter table public.documents enable row level security;
alter table public.document_activity enable row level security;

create policy "workspace owned by current user" on public.workspaces for all using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());
create policy "business access by workspace owner" on public.businesses for all using (exists(select 1 from public.workspaces w where w.id = workspace_id and w.owner_user_id = auth.uid())) with check (exists(select 1 from public.workspaces w where w.id = workspace_id and w.owner_user_id = auth.uid()));
create policy "document access by workspace owner" on public.documents for all using (exists(select 1 from public.workspaces w where w.id = workspace_id and w.owner_user_id = auth.uid())) with check (exists(select 1 from public.workspaces w where w.id = workspace_id and w.owner_user_id = auth.uid()));
create policy "activity access by workspace owner" on public.document_activity for all using (exists(select 1 from public.workspaces w where w.id = workspace_id and w.owner_user_id = auth.uid())) with check (exists(select 1 from public.workspaces w where w.id = workspace_id and w.owner_user_id = auth.uid()));

insert into storage.buckets (id, name, public) values ('vault-documents', 'vault-documents', false) on conflict (id) do nothing;

create policy "private vault read" on storage.objects for select using (
  bucket_id = 'vault-documents' and exists(
    select 1 from public.workspaces w
    where w.id::text = split_part(name, '/', 1) and w.owner_user_id = auth.uid()
  )
);
create policy "private vault write" on storage.objects for insert with check (
  bucket_id = 'vault-documents' and exists(
    select 1 from public.workspaces w
    where w.id::text = split_part(name, '/', 1) and w.owner_user_id = auth.uid()
  )
);
