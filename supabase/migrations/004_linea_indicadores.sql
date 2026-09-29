-- Línea de Atención 24/7: indicadores mensuales agregados (reemplaza el modelo por atención individual)
alter table uploads_linea add column if not exists municipio text;
alter table uploads_linea add column if not exists año integer;

create table if not exists indicadores_linea (
  id uuid primary key default gen_random_uuid(),
  municipio text not null,
  año integer not null,
  mes integer not null check (mes between 1 and 12),
  dimension text not null check (dimension in
    ('llamadas','edad','riesgo','genero','zona','eps','ruta','poblacion','hipotesis')),
  categoria text not null,
  detalle text,
  valor integer not null default 0,
  upload_id uuid references uploads_linea(id) on delete cascade,
  created_at timestamptz default now()
);

create index if not exists idx_indicadores_linea_muni_año on indicadores_linea(municipio, año);
create index if not exists idx_indicadores_linea_dimension on indicadores_linea(dimension);
create index if not exists idx_indicadores_linea_upload on indicadores_linea(upload_id);
