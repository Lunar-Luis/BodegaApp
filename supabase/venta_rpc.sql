-- =====================================================================
--  Tú Bodega Online — Función de venta atómica
--  Registra la venta + sus ítems + descuenta el stock EN UNA SOLA
--  operación (transacción). El stock se calcula en el servidor, así
--  queda correcto aunque los dos teléfonos vendan al mismo tiempo.
--  Ejecutar en Supabase → SQL Editor → Run.
-- =====================================================================

create or replace function registrar_venta(
  p_fecha date,
  p_hora text,
  p_metodo text,
  p_ref4 text,
  p_tasa numeric,
  p_total_usd numeric,
  p_items jsonb            -- [{producto_id, nombre, cantidad, precio_usd}, ...]
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  rec record;
begin
  insert into ventas (fecha, hora, metodo, ref4, tasa, total_usd)
  values (p_fecha, p_hora, p_metodo, nullif(p_ref4, ''), p_tasa, p_total_usd)
  returning id into v_id;

  for rec in select value from jsonb_array_elements(p_items) loop
    insert into venta_items (venta_id, producto_id, nombre, cantidad, precio_usd)
    values (
      v_id,
      (rec.value->>'producto_id')::uuid,
      rec.value->>'nombre',
      (rec.value->>'cantidad')::int,
      (rec.value->>'precio_usd')::numeric
    );

    update productos
       set stock    = greatest(0, stock - (rec.value->>'cantidad')::int),
           vendidos = vendidos + (rec.value->>'cantidad')::int
     where id = (rec.value->>'producto_id')::uuid;
  end loop;

  return v_id;
end $$;

-- Solo usuarios con sesión pueden registrar ventas
revoke all on function registrar_venta(date, text, text, text, numeric, numeric, jsonb) from public, anon;
grant execute on function registrar_venta(date, text, text, text, numeric, numeric, jsonb) to authenticated;
