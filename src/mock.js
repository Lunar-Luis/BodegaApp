// Datos simulados (mock) — luego se reemplazan por la base de datos real (Supabase).

export const TASA_INICIAL = 42.5 // Bs por 1 USD

// moneda: 'USD' o 'VES'. precio en su propia moneda. 'vendidos' = unidades vendidas (para ordenar los más vendidos).
export const PRODUCTOS_INICIALES = [
  { id: 1, nombre: 'Harina P.A.N.', icon: 'bag', unidad: 'Unidad', cat: 'Alimentos', precio: 1.2, moneda: 'USD', stock: 2, minimo: 5, vendidos: 40 },
  { id: 2, nombre: 'Arroz Blanco 1kg', icon: 'bag', unidad: 'Unidad', cat: 'Alimentos', precio: 1.0, moneda: 'USD', stock: 18, minimo: 6, vendidos: 25 },
  { id: 3, nombre: 'Refresco Cola 2L', icon: 'bottle', unidad: 'Unidad', cat: 'Bebidas', precio: 2.5, moneda: 'USD', stock: 1, minimo: 4, vendidos: 30 },
  { id: 4, nombre: 'Queso Blanco (kg)', icon: 'cheese', unidad: 'Kg', cat: 'Alimentos', precio: 4.0, moneda: 'USD', stock: 6, minimo: 2, vendidos: 8 },
  { id: 5, nombre: 'Azúcar Refinada', icon: 'bag', unidad: 'Unidad', cat: 'Alimentos', precio: 55, moneda: 'VES', stock: 34, minimo: 8, vendidos: 15 },
  { id: 6, nombre: 'Café Molido 250g', icon: 'coffee', unidad: 'Unidad', cat: 'Alimentos', precio: 3.2, moneda: 'USD', stock: 9, minimo: 4, vendidos: 12 },
  { id: 7, nombre: 'Jabón de Baño', icon: 'soap', unidad: 'Unidad', cat: 'Hogar', precio: 35, moneda: 'VES', stock: 22, minimo: 10, vendidos: 6 },
  { id: 8, nombre: 'Pan Canilla', icon: 'bread', unidad: 'Unidad', cat: 'Alimentos', precio: 0.8, moneda: 'USD', stock: 15, minimo: 5, vendidos: 50 },
]

// Categorías reales (las crea/edita la clienta). 'Todos' y 'Stock bajo' son filtros especiales.
export const CATEGORIAS_INICIALES = ['Alimentos', 'Bebidas', 'Hogar']

// Métodos de pago que acepta la tienda
export const METODOS = [
  { id: 'efectivo_usd', label: 'Efectivo $', moneda: 'USD' },
  { id: 'efectivo_bs', label: 'Efectivo Bs', moneda: 'VES' },
  { id: 'pago_movil', label: 'Pago móvil', moneda: 'VES' },
]

export const metodoLabel = (id) => METODOS.find((m) => m.id === id)?.label || id

// Ventas/gastos simulados (para el Historial). Cada registro guarda:
//  - 'fecha' (YYYY-MM-DD) → permite buscar por día y por mes.
//  - 'tasa' del día en que se hizo → el historial NO cambia si mañana sube el dólar.
export const ACTIVIDAD_INICIAL = [
  // Hoy (2026-07-30) — tasa 42,50
  { id: 1048, tipo: 'venta', fecha: '2026-07-30', hora: '14:30', metodo: 'efectivo_bs', tasa: 42.5, usd: 15.5, items: ['2x Harina P.A.N.', '1x Queso (kg)', 'Refresco Cola 2L'] },
  { id: 1047, tipo: 'venta', fecha: '2026-07-30', hora: '11:10', metodo: 'pago_movil', ref4: '4821', tasa: 42.5, usd: 8.0, items: ['4x Pan Canilla', '2x Café Molido'] },
  { id: 9001, tipo: 'gasto', fecha: '2026-07-30', hora: '10:15', cat: 'Inventario', desc: 'Compra de mercancía', tasa: 42.5, usd: 20.0 },
  { id: 1046, tipo: 'venta', fecha: '2026-07-30', hora: '09:30', metodo: 'efectivo_usd', tasa: 42.5, usd: 5.0, items: ['1x Arroz Blanco', '3x Jabón'] },
  { id: 9002, tipo: 'gasto', fecha: '2026-07-30', hora: '08:00', cat: 'Gasto', desc: 'Bolsas plásticas', tasa: 42.5, usd: 3.5 },
  // Ayer (2026-07-29) — tasa 41,80
  { id: 1045, tipo: 'venta', fecha: '2026-07-29', hora: '16:20', metodo: 'efectivo_usd', tasa: 41.8, usd: 12.0, items: ['3x Café Molido', '1x Azúcar'] },
  { id: 1044, tipo: 'venta', fecha: '2026-07-29', hora: '10:05', metodo: 'pago_movil', ref4: '2093', tasa: 41.8, usd: 6.5, items: ['2x Jabón', '5x Pan Canilla'] },
  { id: 9003, tipo: 'gasto', fecha: '2026-07-29', hora: '09:00', cat: 'Gasto', desc: 'Pago de electricidad', tasa: 41.8, usd: 5.0 },
  // 2026-07-28 — tasa 41,50
  { id: 1043, tipo: 'venta', fecha: '2026-07-28', hora: '13:40', metodo: 'efectivo_bs', tasa: 41.5, usd: 9.0, items: ['1x Queso (kg)', '2x Harina P.A.N.'] },
  // Mes anterior (2026-06-15) — tasa 38,90
  { id: 1030, tipo: 'venta', fecha: '2026-06-15', hora: '12:00', metodo: 'efectivo_usd', tasa: 38.9, usd: 20.0, items: ['Compra grande cliente'] },
  { id: 9004, tipo: 'gasto', fecha: '2026-06-15', hora: '08:30', cat: 'Inversión', desc: 'Nevera pequeña', tasa: 38.9, usd: 80.0 },
]

export const DIAS = [
  { dw: 'Lun', dn: 21 },
  { dw: 'Mar', dn: 22 },
  { dw: 'Mié', dn: 23 },
  { dw: 'Jue', dn: 24 },
  { dw: 'Vie', dn: 25 },
]
