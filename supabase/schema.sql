-- =====================================================================
--  Tú Bodega Online — Esquema de base de datos
--  Pegar y ejecutar en Supabase → SQL Editor → New query → Run
-- =====================================================================

-- ---------- TABLAS ----------

create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  created_at timestamptz default now()
);

create table if not exists productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  icon text default 'box',
  unidad text default 'Unidad',
  cat text,
  precio numeric not null default 0,
  moneda text not null default 'USD',        -- 'USD' o 'VES'
  stock integer not null default 0,
  minimo integer not null default 0,
  vendidos integer not null default 0,
  foto_url text,                             -- foto del producto (opcional)
  activo boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists ventas (
  id uuid primary key default gen_random_uuid(),
  fecha date not null default current_date,
  hora text,
  metodo text not null,                      -- efectivo_usd | efectivo_bs | pago_movil
  ref4 text,                                 -- últimos 4 dígitos (pago móvil)
  tasa numeric not null,                     -- tasa usada en esta venta
  total_usd numeric not null,
  created_at timestamptz default now()
);

create table if not exists venta_items (
  id uuid primary key default gen_random_uuid(),
  venta_id uuid not null references ventas(id) on delete cascade,
  producto_id uuid references productos(id) on delete set null,
  nombre text not null,
  cantidad integer not null,
  precio_usd numeric not null
);

create table if not exists gastos (
  id uuid primary key default gen_random_uuid(),
  fecha date not null default current_date,
  hora text,
  cat text not null,                         -- Inventario | Inversión | Gasto
  descripcion text,
  tasa numeric not null,
  monto_usd numeric not null,
  created_at timestamptz default now()
);

-- Configuración (una sola fila): tasa del día actual
create table if not exists config (
  id integer primary key default 1,
  tasa numeric not null default 42.5,
  check (id = 1)
);
insert into config (id, tasa) values (1, 42.5) on conflict (id) do nothing;

-- ---------- ÍNDICES ----------
create index if not exists idx_ventas_fecha on ventas(fecha);
create index if not exists idx_gastos_fecha on gastos(fecha);
create index if not exists idx_venta_items_venta on venta_items(venta_id);

-- ---------- RLS (seguridad a nivel de fila) ----------
-- Por ahora: acceso abierto con la llave pública (etapa de desarrollo).
-- Cuando agreguemos el login compartido, cambiaremos estas políticas a 'authenticated'.
alter table categorias   enable row level security;
alter table productos    enable row level security;
alter table ventas       enable row level security;
alter table venta_items  enable row level security;
alter table gastos       enable row level security;
alter table config       enable row level security;

do $$
declare t text;
begin
  foreach t in array array['categorias','productos','ventas','venta_items','gastos','config']
  loop
    execute format('drop policy if exists "acceso_app" on %I', t);
    execute format('create policy "acceso_app" on %I for all to anon, authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- ---------- REALTIME (sincronización entre dispositivos) ----------
alter publication supabase_realtime add table productos;
alter publication supabase_realtime add table ventas;
alter publication supabase_realtime add table venta_items;
alter publication supabase_realtime add table gastos;
alter publication supabase_realtime add table categorias;
alter publication supabase_realtime add table config;

-- ---------- STORAGE (fotos de productos) ----------
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

drop policy if exists "fotos_lectura"  on storage.objects;
drop policy if exists "fotos_subida"   on storage.objects;
drop policy if exists "fotos_update"   on storage.objects;
drop policy if exists "fotos_delete"   on storage.objects;

create policy "fotos_lectura" on storage.objects for select to anon, authenticated using (bucket_id = 'productos');
create policy "fotos_subida"  on storage.objects for insert to anon, authenticated with check (bucket_id = 'productos');
create policy "fotos_update"  on storage.objects for update to anon, authenticated using (bucket_id = 'productos');
create policy "fotos_delete"  on storage.objects for delete to anon, authenticated using (bucket_id = 'productos');
