export type WorkspaceRole = "owner" | "admin" | "manager" | "viewer" | "external";
export type MemberStatus = "invited" | "active" | "removed";

export type Workspace = { id: string; name: string; owner_user_id: string; created_at: string; updated_at: string };
export type Business = { id: string; workspace_id: string; name: string; industry: string | null; location: string | null; logo_url: string | null; brand_color: string | null; notes: string | null; archived: boolean; created_at: string; updated_at: string };
export type DocumentStatus = "Active" | "Draft" | "Needs Review" | "Expired" | "Archived";
export type Doc = { id: string; workspace_id: string; business_id: string; category: string; document_type: string; status: DocumentStatus; title: string; notes: string | null; tags: string[]; file_url: string; original_file_name: string; stored_file_name: string; file_extension: string; mime_type: string; file_size: number; uploaded_by: string; archived: boolean; created_at: string; updated_at: string; business?: Pick<Business, "id"|"name"> };
export type Activity = { id: string; workspace_id: string; business_id: string; document_id: string | null; user_id: string; action: string; description: string; metadata: Record<string, unknown> | null; created_at: string };

export type WorkspaceMember = { id: string; workspace_id: string; user_id: string | null; invited_email: string; role: WorkspaceRole; status: MemberStatus; invited_by: string; created_at: string; updated_at: string };
export type BusinessMember = { id: string; workspace_id: string; business_id: string; user_id: string; role: WorkspaceRole; created_at: string; updated_at: string };
export type DocumentVersion = { id: string; document_id: string; workspace_id: string; business_id: string; version_number: number; file_url: string; original_file_name: string; stored_file_name: string; mime_type: string; file_size: number; uploaded_by: string; notes: string | null; created_at: string };
export type DocumentShare = { id: string; workspace_id: string; document_id: string; shared_with_user_id: string; shared_by_user_id: string; can_view: boolean; can_download: boolean; expires_at: string | null; note: string | null; revoked_at: string | null; created_at: string };
