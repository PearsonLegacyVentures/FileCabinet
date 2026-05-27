export const demoModeMessage = "Demo mode: connect Supabase to save documents and enable secure storage.";

export const workspace = {
  name: "File Cabinet Workspace",
  owner: "Operations Team",
};

export const businesses = [
  { id: "biz-1", name: "Northline Logistics", status: "Active", docs: 34, updated: "May 24, 2026" },
  { id: "biz-2", name: "Harborview Dental", status: "Active", docs: 19, updated: "May 22, 2026" },
  { id: "biz-3", name: "Summit Field Services", status: "Archived", docs: 12, updated: "May 16, 2026" },
];

export const documents = [
  { id: "doc-1", title: "Q2 Insurance Certificate", business: "Northline Logistics", category: "Compliance", status: "Needs Review", tags: ["renewal", "priority"], uploadedBy: "A. Brooks", uploadedAt: "May 24, 2026", size: "1.2 MB" },
  { id: "doc-2", title: "Employee Handbook v3", business: "Harborview Dental", category: "HR", status: "Approved", tags: ["policy"], uploadedBy: "M. Rivera", uploadedAt: "May 23, 2026", size: "4.7 MB" },
  { id: "doc-3", title: "Vendor Master Agreement", business: "Northline Logistics", category: "Legal", status: "In Review", tags: ["vendor", "contract"], uploadedBy: "S. Lee", uploadedAt: "May 21, 2026", size: "2.1 MB" },
  { id: "doc-4", title: "Site Safety Checklist", business: "Summit Field Services", category: "Operations", status: "Approved", tags: ["safety"], uploadedBy: "R. Kim", uploadedAt: "May 20, 2026", size: "860 KB" },
];

export const activity = [
  { id: "act-1", action: "Document uploaded", business: "Northline Logistics", document: "Q2 Insurance Certificate", user: "A. Brooks", timestamp: "2026-05-24 10:42" },
  { id: "act-2", action: "Status changed to In Review", business: "Northline Logistics", document: "Vendor Master Agreement", user: "S. Lee", timestamp: "2026-05-21 14:05" },
  { id: "act-3", action: "Business archived", business: "Summit Field Services", document: "—", user: "Admin", timestamp: "2026-05-16 09:12" },
];
