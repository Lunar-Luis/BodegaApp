-- =====================================================================
--  Tú Bodega Online — Refuerzo de seguridad del Storage (fotos)
--  Limita el bucket de fotos: solo imágenes y máximo 3 MB por archivo.
--  Evita que alguien suba archivos grandes o de otro tipo.
--  Ejecutar en Supabase → SQL Editor → Run.
-- =====================================================================

update storage.buckets
set file_size_limit   = 3145728,  -- 3 MB por foto (de sobra: comprimimos a ~50-100 KB)
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'productos';
