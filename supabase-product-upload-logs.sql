create table if not exists product_upload_logs (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  uploaded_count integer not null default 0,
  created_at timestamptz not null default now()
);
