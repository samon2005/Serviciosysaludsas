create table if not exists uploads_linea (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  rows_imported integer default 0,
  uploaded_at timestamptz default now()
);

create table if not exists atenciones_linea (
  id uuid primary key default gen_random_uuid(),
  fecha date not null,
  hora time,
  canal text not null,
  sexo text,
  grupo_etario text,
  municipio text,
  motivo text,
  nivel_riesgo text,
  ruta_activada boolean default false,
  canalizado_a text,
  estado_seguimiento text,
  upload_id uuid references uploads_linea(id) on delete cascade,
  created_at timestamptz default now()
);

create index if not exists idx_atenciones_fecha on atenciones_linea(fecha);
create index if not exists idx_atenciones_municipio on atenciones_linea(municipio);
create index if not exists idx_atenciones_riesgo on atenciones_linea(nivel_riesgo);
create index if not exists idx_atenciones_upload_id on atenciones_linea(upload_id);
