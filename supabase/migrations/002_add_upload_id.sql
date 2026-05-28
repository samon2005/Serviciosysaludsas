alter table eventos add column if not exists upload_id uuid references uploads(id) on delete cascade;
create index if not exists idx_eventos_upload_id on eventos(upload_id);
