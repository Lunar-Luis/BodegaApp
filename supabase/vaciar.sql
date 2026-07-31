-- =====================================================================
--  Tú Bodega Online — Vaciar datos para empezar limpio
--  Borra productos, ventas y gastos (datos de prueba/demo).
--  NO toca: la seguridad (RLS), la tasa (config), ni la cuenta de login.
--  Ejecutar en Supabase → SQL Editor → Run.
--  ⚠️ Esto BORRA de forma permanente el inventario y el historial.
-- =====================================================================

truncate table venta_items, ventas, gastos, productos restart identity cascade;

-- OPCIONAL: si también quieres borrar las categorías (dejar TODO en blanco),
-- quita los dos guiones de la línea de abajo:
-- truncate table categorias;

-- OPCIONAL: reiniciar la tasa del día a un valor base (no borra la fila):
-- update config set tasa = 42.5 where id = 1;
