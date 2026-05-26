# Phase 1 Setup: Multi-Business Document Vault

## Environment variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Supabase setup
1. Run SQL migration in `supabase/migrations/202605260001_phase1_document_vault.sql`.
2. Confirm private bucket `vault-documents` exists.
3. Ensure RLS is enabled and policies are created for:
   - `workspaces`
   - `businesses`
   - `documents`
   - `document_activity`
   - `storage.objects`

## Storage path convention
Use: `workspace_id/business_id/document_id/original_filename`

## Current Phase 1 scope delivered
- Auth-gated app routes (`/app/*`)
- Workspace-ready schema and RLS model
- Businesses, documents, activity, dashboard, settings shells
- Category and status defaults for UI
- Private bucket and storage ownership policies

## Incomplete for next iteration
- Full CRUD forms connected to Supabase tables
- Business switcher persisted session state
- Signed URL view/download actions in document rows
- Upload progress UI wired to storage upload callbacks
- Dashboard aggregate queries and charts
- Activity write hooks for all mutating actions
