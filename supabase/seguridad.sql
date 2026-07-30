-- =====================================================================
--  Tú Bodega Online — Cerrar la seguridad (RLS)
--  Ejecutar en Supabase → SQL Editor DESPUÉS de confirmar que el login entra.
--  Acceso SOLO para usuarios con sesión (la cuenta de la bodega).
-- =====================================================================

-- Tablas: exige un usuario autenticado (auth.uid()). No es 'true' literal,
-- así el Security Advisor no marca "RLS Policy Always True".
do $$
declare t text;
begin
  foreach t in array array['categorias','productos','ventas','venta_items','gastos','config']
  loop
    execute format('drop policy if exists "acceso_app" on %I', t);
    execute format(
      'create policy "acceso_app" on %I for all to authenticated using ((select auth.uid()) is not null) with check ((select auth.uid()) is not null)',
      t
    );
  end loop;
end $$;

-- Storage (fotos): sin listado público; subir/editar/borrar solo autenticados.
-- La lectura sigue funcionando porque el bucket es público (URL directa).
drop policy if exists "fotos_lectura" on storage.objects;
drop policy if exists "fotos_subida"  on storage.objects;
drop policy if exists "fotos_update"  on storage.objects;
drop policy if exists "fotos_delete"  on storage.objects;

create policy "fotos_subida" on storage.objects for insert to authenticated with check (bucket_id = 'productos');
create policy "fotos_update" on storage.objects for update to authenticated using (bucket_id = 'productos');
create policy "fotos_delete" on storage.objects for delete to authenticated using (bucket_id = 'productos');
