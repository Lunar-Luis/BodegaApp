import { supabase } from './supabase.js'
import { enUSD } from './format.js'

function mapProducto(r) {
  return {
    id: r.id,
    nombre: r.nombre,
    icon: r.icon || 'box',
    unidad: r.unidad || 'Unidad',
    cat: r.cat || '',
    precio: Number(r.precio),
    moneda: r.moneda,
    stock: r.stock,
    minimo: r.minimo,
    vendidos: r.vendidos || 0,
    foto_url: r.foto_url || null,
  }
}

// Carga todo el estado de la app desde Supabase
export async function cargarTodo() {
  const [prod, ventas, gastos, cats, conf] = await Promise.all([
    supabase.from('productos').select('*').eq('activo', true).order('created_at', { ascending: false }),
    supabase.from('ventas').select('*, venta_items(*)').order('created_at', { ascending: true }),
    supabase.from('gastos').select('*').order('created_at', { ascending: false }),
    supabase.from('categorias').select('nombre').order('nombre'),
    supabase.from('config').select('tasa').eq('id', 1).single(),
  ])

  const productos = (prod.data || []).map(mapProducto)

  const ventasMap = (ventas.data || []).map((v, i) => ({
    id: v.id,
    numero: 1000 + i + 1, // número de ticket estable por orden de creación
    tipo: 'venta',
    fecha: v.fecha,
    hora: v.hora,
    metodo: v.metodo,
    ref4: v.ref4 || undefined,
    tasa: Number(v.tasa),
    usd: Number(v.total_usd),
    items: (v.venta_items || []).map((it) => `${it.cantidad}x ${it.nombre}`),
  }))

  const gastosMap = (gastos.data || []).map((g) => ({
    id: g.id,
    tipo: 'gasto',
    fecha: g.fecha,
    hora: g.hora,
    cat: g.cat,
    desc: g.descripcion,
    tasa: Number(g.tasa),
    usd: Number(g.monto_usd),
  }))

  const actividad = [...ventasMap, ...gastosMap].sort((a, b) => {
    if (a.fecha !== b.fecha) return b.fecha.localeCompare(a.fecha)
    return (b.hora || '').localeCompare(a.hora || '')
  })

  const categorias = (cats.data || []).map((c) => c.nombre)
  const tasa = conf.data?.tasa != null ? Number(conf.data.tasa) : 42.5

  return { productos, actividad, categorias, tasa }
}

export async function guardarTasa(valor) {
  return supabase.from('config').update({ tasa: valor }).eq('id', 1)
}

export async function crearProducto(p) {
  return supabase.from('productos').insert({
    nombre: p.nombre, icon: p.icon, unidad: p.unidad, cat: p.cat,
    precio: p.precio, moneda: p.moneda, stock: p.stock, minimo: p.minimo, vendidos: 0,
    foto_url: p.foto_url || null,
  })
}

export async function actualizarProducto(id, cambios) {
  return supabase.from('productos').update(cambios).eq('id', id)
}

export async function crearGasto(g) {
  return supabase.from('gastos').insert({
    fecha: g.fecha, hora: g.hora, cat: g.cat, descripcion: g.desc, tasa: g.tasa, monto_usd: g.usd,
  })
}

export async function crearCategoria(nombre) {
  return supabase.from('categorias').insert({ nombre })
}

// Sube una foto (blob) al bucket 'productos' y devuelve su URL pública
export async function subirFoto(blob) {
  const nombre = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const { error } = await supabase.storage.from('productos').upload(nombre, blob, {
    contentType: 'image/jpeg',
    upsert: false,
  })
  if (error) return { error }
  const { data } = supabase.storage.from('productos').getPublicUrl(nombre)
  return { url: data.publicUrl }
}

// Registra una venta completa: cabecera + ítems + descuento de stock/vendidos
export async function crearVenta(venta, carrito, tasa) {
  const { data: v, error } = await supabase
    .from('ventas')
    .insert({
      fecha: venta.fecha, hora: venta.hora, metodo: venta.metodo,
      ref4: venta.ref4 || null, tasa: venta.tasa, total_usd: venta.usd,
    })
    .select()
    .single()
  if (error || !v) return { error }

  const items = carrito.map((c) => ({
    venta_id: v.id,
    producto_id: c.id,
    nombre: c.nombre,
    cantidad: c.qty,
    precio_usd: enUSD(c, tasa),
  }))
  await supabase.from('venta_items').insert(items)

  // Descontar stock y sumar vendidos por producto
  for (const c of carrito) {
    await supabase
      .from('productos')
      .update({ stock: Math.max(0, c.stock - c.qty), vendidos: (c.vendidos || 0) + c.qty })
      .eq('id', c.id)
  }
  return { data: v }
}
