create extension if not exists pgcrypto;

create type public.workspace_role as enum ('owner','admin','manager','viewer','external');
create type public.member_status as enum ('invited','active','removed');

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  invited_email text not null,
  role public.workspace_role not null,
  status public.member_status not null default 'invited',
  invited_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(workspace_id, invited_email)
);

create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.workspace_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(business_id, user_id)
);

create table if not exists public.document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  version_number integer not null check (version_number > 0),
  file_url text not null,
  original_file_name text not null,
  stored_file_name text not null,
  mime_type text not null,
  file_size bigint not null,
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  notes text,
  created_at timestamptz not null default now(),
  unique(document_id, version_number)
);

create table if not exists public.document_shares (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  shared_with_user_id uuid not null references auth.users(id) on delete cascade,
  shared_by_user_id uuid not null references auth.users(id) on delete restrict,
  can_view boolean not null default true,
  can_download boolean not null default true,
  expires_at timestamptz,
  note text,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique(document_id, shared_with_user_id)
);

create index if not exists idx_workspace_members_workspace_status on public.workspace_members(workspace_id, status);
create index if not exists idx_business_members_business_user on public.business_members(business_id, user_id);
create index if not exists idx_document_versions_document_created on public.document_versions(document_id, created_at desc);
create index if not exists idx_document_shares_document_user on public.document_shares(document_id, shared_with_user_id);

alter table public.document_activity alter column document_id drop not null;

create or replace function public.is_workspace_admin(target_workspace uuid)
returns boolean language sql stable as $$
  select exists(
    select 1 from public.workspaces w where w.id = target_workspace and w.owner_user_id = auth.uid()
  ) or exists(
    select 1 from public.workspace_members wm
    where wm.workspace_id = target_workspace and wm.user_id = auth.uid() and wm.status = 'active' and wm.role in ('owner','admin')
  );
$$;

create or replace function public.can_access_business(target_workspace uuid, target_business uuid)
returns boolean language sql stable as $$
  select public.is_workspace_admin(target_workspace)
  or exists (
    select 1 from public.business_members bm
    where bm.workspace_id = target_workspace and bm.business_id = target_business and bm.user_id = auth.uid()
  );
$$;

drop policy if exists "business access by workspace owner" on public.businesses;
drop policy if exists "document access by workspace owner" on public.documents;
drop policy if exists "activity access by workspace owner" on public.document_activity;

alter table public.workspace_members enable row level security;
alter table public.business_members enable row level security;
alter table public.document_versions enable row level security;
alter table public.document_shares enable row level security;

create policy "business visibility by role" on public.businesses for select using (public.can_access_business(workspace_id, id));
create policy "business mutate by admin" on public.businesses for all using (public.is_workspace_admin(workspace_id)) with check (public.is_workspace_admin(workspace_id));

create policy "document visibility by business access or share" on public.documents for select using (
  public.can_access_business(workspace_id, business_id) or exists (
    select 1 from public.document_shares ds
    where ds.document_id = id and ds.shared_with_user_id = auth.uid() and ds.can_view = true and ds.revoked_at is null and (ds.expires_at is null or ds.expires_at > now())
  )
);
create policy "document mutate by non-readonly roles" on public.documents for all using (
  public.is_workspace_admin(workspace_id) or exists (
    select 1 from public.business_members bm
    where bm.workspace_id = workspace_id and bm.business_id = business_id and bm.user_id = auth.uid() and bm.role in ('manager')
  )
) with check (
  public.is_workspace_admin(workspace_id) or exists (
    select 1 from public.business_members bm
    where bm.workspace_id = workspace_id and bm.business_id = business_id and bm.user_id = auth.uid() and bm.role in ('manager')
  )
);

create policy "workspace members read own workspace" on public.workspace_members for select using (
  public.is_workspace_admin(workspace_id) or user_id = auth.uid()
);
create policy "workspace members mutate by admin" on public.workspace_members for all using (public.is_workspace_admin(workspace_id)) with check (public.is_workspace_admin(workspace_id));

create policy "business members read by admin-or-self" on public.business_members for select using (public.is_workspace_admin(workspace_id) or user_id = auth.uid());
create policy "business members mutate by admin" on public.business_members for all using (public.is_workspace_admin(workspace_id)) with check (public.is_workspace_admin(workspace_id));

create policy "shares visible to participants" on public.document_shares for select using (shared_with_user_id = auth.uid() or shared_by_user_id = auth.uid() or public.is_workspace_admin(workspace_id));
create policy "shares create by admin-manager" on public.document_shares for insert with check (
  public.is_workspace_admin(workspace_id) or exists (
    select 1 from public.business_members bm join public.documents d on d.id = document_id and d.business_id = bm.business_id
    where bm.user_id = auth.uid() and bm.role = 'manager' and bm.workspace_id = workspace_id
  )
);
create policy "shares revoke by creator-or-admin" on public.document_shares for update using (shared_by_user_id = auth.uid() or public.is_workspace_admin(workspace_id));

create policy "versions visibility" on public.document_versions for select using (public.can_access_business(workspace_id, business_id));
create policy "versions mutate by admin-manager" on public.document_versions for all using (
  public.is_workspace_admin(workspace_id) or exists(select 1 from public.business_members bm where bm.workspace_id = workspace_id and bm.business_id = business_id and bm.user_id = auth.uid() and bm.role = 'manager')
) with check (
  public.is_workspace_admin(workspace_id) or exists(select 1 from public.business_members bm where bm.workspace_id = workspace_id and bm.business_id = business_id and bm.user_id = auth.uid() and bm.role = 'manager')
);

create policy "activity visibility by business scope" on public.document_activity for select using (public.can_access_business(workspace_id, business_id));
create policy "activity write by workspace access" on public.document_activity for insert with check (public.can_access_business(workspace_id, business_id));

create or replace function public.log_document_activity(
  target_workspace uuid,
  target_business uuid,
  target_document uuid,
  target_action text,
  target_description text,
  target_metadata jsonb default null
) returns void language sql security definer as $$
  insert into public.document_activity(workspace_id,business_id,document_id,user_id,action,description,metadata)
  values (target_workspace, target_business, target_document, auth.uid(), target_action, target_description, target_metadata);
$$;
