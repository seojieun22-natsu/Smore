alter table receipt_items
add column if not exists manager_name text;

-- Vercel environment variable needed for admin mode password gate
-- Name: NEXT_PUBLIC_RECEIVING_ADMIN_PASSWORD
-- Example value: your-admin-password
