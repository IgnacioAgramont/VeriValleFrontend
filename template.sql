-- schema_verifications.sql
create table if not exists verifications (
  id uuid primary key default gen_random_uuid(),
  input_type text not null,         -- "text" | "image"
  input_text text,
  source_url text,
  result jsonb,
  raw_text text,
  snippets jsonb,
  matches jsonb,
  exif jsonb,
  created_at timestamptz default now(),
  published boolean default false
);

create index if not exists verifications_created_at_idx on verifications (created_at desc);
