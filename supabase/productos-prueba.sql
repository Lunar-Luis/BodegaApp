-- =====================================================================
--  Tú Bodega Online — 100 productos de prueba (para medir velocidad)
--  Ejecutar en Supabase → SQL Editor → Run.
--  Para borrarlos luego, usa supabase/vaciar.sql.
-- =====================================================================

with nombres(n, ord) as (
  select * from unnest(array[
    'Harina de maíz P.A.N.','Harina de trigo Leudante','Arroz Blanco Primor','Arroz Integral',
    'Pasta Larga Spaghetti','Pasta Corta Coditos','Azúcar Refinada','Sal Refinada',
    'Aceite de Maíz','Aceite Vegetal','Mantequilla','Margarina','Mayonesa','Salsa de Tomate',
    'Kétchup','Mostaza','Atún en Lata','Sardinas en Lata','Caraotas Negras','Caraotas Rojas',
    'Lentejas','Arvejas','Garbanzos','Frijoles','Avena en Hojuelas','Café Molido','Café en Grano',
    'Leche en Polvo','Leche Líquida','Leche Condensada','Queso Blanco','Queso Amarillo',
    'Jamón de Pierna','Mortadela','Cartón de Huevos','Pan Canilla','Pan de Sándwich',
    'Galletas María','Galletas de Soda','Casabe','Harina de Avena','Diablitos','Papelón',
    'Vinagre','Ají Dulce','Cebolla','Ajo','Tomate','Papa','Plátano','Yuca','Zanahoria',
    'Pimentón','Limón','Refresco Cola 2L','Refresco Naranja 2L','Malta','Agua Mineral 1.5L',
    'Jugo de Naranja','Jugo de Manzana','Té Frío','Cerveza Lata','Papelón con Limón',
    'Chocolate en Barra','Chicles','Caramelos Surtidos','Chupetas','Cotufas','Papas Fritas',
    'Doritos','Galletas Dulces','Bombones','Jabón de Baño','Jabón Azul','Detergente en Polvo',
    'Cloro','Desinfectante','Suavizante','Lavaplatos Líquido','Esponja de Cocina',
    'Papel Higiénico','Servilletas','Toallas de Papel','Bolsas Plásticas','Fósforos','Velas',
    'Pañales','Toallas Sanitarias','Champú','Crema Dental','Cepillo de Dientes','Desodorante',
    'Afeitadora','Pilas AA','Bombillo LED','Encendedor','Cigarrillos','Vegetales en Lata',
    'Compota','Cereal en Caja','Toallín'
  ]) with ordinality
)
insert into productos (nombre, icon, unidad, cat, precio, moneda, stock, minimo, vendidos)
select
  n,
  (array['bag','bottle','box','soap','coffee','bread','cheese'])[1 + (ord % 7)],
  'Unidad',
  (array['Alimentos','Bebidas','Limpieza','Golosinas','Hogar'])[1 + (ord % 5)],
  case when ord % 6 = 0 then round((random() * 450 + 30)::numeric, 2)
       else round((random() * 7.5 + 0.4)::numeric, 2) end,
  case when ord % 6 = 0 then 'VES' else 'USD' end,
  floor(random() * 58 + 2)::int,
  5,
  floor(random() * 90)::int
from nombres;
