create table if not exists eventos (
  id uuid primary key default gen_random_uuid(),
  departamento text not null,
  municipio text,
  año integer not null,
  mes integer check (mes between 1 and 12),
  sexo text,
  grupo_etario text,
  metodo text,
  tipo_evento text,
  programa text,
  casos integer not null default 0,
  created_at timestamptz default now()
);

create index if not exists idx_eventos_departamento on eventos(departamento);
create index if not exists idx_eventos_año on eventos(año);
create index if not exists idx_eventos_programa on eventos(programa);

create table if not exists uploads (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  rows_imported integer default 0,
  uploaded_at timestamptz default now()
);
