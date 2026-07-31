import { useState } from 'react'
import Header from '../components/Header.jsx'
import { Search, Plus, Close, Check, Edit, Camera, Trash, ProductIcon } from '../icons.jsx'
import { fmtUSD, fmtBs, enUSD, enBs } from '../format.js'
import { comprimirImagen } from '../image.js'
import { subirFoto } from '../db.js'

// Miniatura: muestra la foto del producto o, si no tiene, su ícono por tipo
export function Miniatura({ producto, size = 24 }) {
  if (producto.foto_url) return <img src={producto.foto_url} alt={producto.nombre} className="prod-img" />
  return <ProductIcon name={producto.icon} size={size} color="var(--primary)" />
}

// Selector/subida de foto (cámara o galería) con compresión automática
function FotoPicker({ foto, onFoto }) {
  const [subiendo, setSubiendo] = useState(false)
  const [preview, setPreview] = useState(foto || null)

  const elegir = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setSubiendo(true)
    const blob = await comprimirImagen(file)
    const { url } = await subirFoto(blob)
    setSubiendo(false)
    if (url) { setPreview(url); onFoto(url) }
  }

  return (
    <div className="foto-picker">
      <label className="foto-box">
        {preview ? <img src={preview} alt="" /> : (
          <span className="foto-empty"><Camera size={26} /><span>Agregar foto</span></span>
        )}
        {subiendo && <span className="foto-cargando"><span className="spinner" /></span>}
        <input type="file" accept="image/*" onChange={elegir} hidden />
      </label>
      {preview && !subiendo && (
        <button type="button" className="foto-quitar" onClick={() => { setPreview(null); onFoto(null) }}>
          <Trash size={16} /> Quitar foto
        </button>
      )}
    </div>
  )
}

export default function Productos({ tasa, productos, categorias, onAdd, onEditar, onReponer, onGasto, onNuevaCategoria }) {
  const [filtro, setFiltro] = useState('Todos')
  const [q, setQ] = useState('')
  const [sheet, setSheet] = useState(null) // 'nuevo' | producto (ficha) | null

  const lista = productos.filter((p) => {
    if (q && !p.nombre.toLowerCase().includes(q.toLowerCase())) return false
    if (filtro === 'Todos') return true
    if (filtro === 'Stock bajo') return p.stock <= p.minimo
    return p.cat === filtro
  })

  const chips = ['Todos', 'Stock bajo', ...categorias]

  return (
    <>
      <Header />
      <div className="screen">
        <div style={{ position: 'relative', marginBottom: 6 }}>
          <span style={{ position: 'absolute', left: 14, top: 15, color: 'var(--outline)' }}><Search size={20} /></span>
          <input className="input" style={{ paddingLeft: 44 }} placeholder="Buscar productos..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <div className="chips">
          {chips.map((c) => (
            <button key={c} className={`chip ${filtro === c ? 'active' : ''}`} onClick={() => setFiltro(c)}>{c}</button>
          ))}
        </div>

        <div className="section-head" style={{ marginTop: 6 }}>
          <div>
            <div className="h-section">Inventario</div>
            <div className="muted tiny">{lista.length} artículos</div>
          </div>
        </div>

        <div className="card list" style={{ marginTop: 6 }}>
          {lista.map((p) => {
            const low = p.stock <= p.minimo
            const agotado = p.stock <= 0
            return (
              <button className="row" key={p.id} onClick={() => setSheet(p)} style={{ width: '100%', textAlign: 'left', background: 'none' }}>
                <div className="left">
                  <div className="avatar thumb"><Miniatura producto={p} size={24} /></div>
                  <div style={{ minWidth: 0 }}>
                    <div className="name" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {p.nombre} {agotado ? <span className="tag-low">AGOTADO</span> : low && <span className="tag-low">POCO STOCK</span>}
                    </div>
                    <div className="sub">{p.cat} · <span className={`stock-pill ${low ? 'low' : ''}`} style={{ padding: '1px 8px' }}>{p.stock} disp.</span></div>
                  </div>
                </div>
                <div className="dual">
                  <div className="u" style={{ color: 'var(--primary)' }}>{fmtUSD(enUSD(p, tasa))}</div>
                  <div className="b">{fmtBs(enBs(p, tasa))}</div>
                </div>
              </button>
            )
          })}
          {lista.length === 0 && <div className="empty">No hay productos en este filtro.</div>}
        </div>
      </div>

      <button className="fab" onClick={() => setSheet('nuevo')} aria-label="Agregar producto"><Plus size={26} /></button>

      {sheet === 'nuevo' && (
        <NuevoProducto categorias={categorias} onClose={() => setSheet(null)} onAdd={onAdd} onNuevaCategoria={onNuevaCategoria} />
      )}
      {sheet && sheet !== 'nuevo' && (
        <FichaProducto
          producto={sheet}
          categorias={categorias}
          tasa={tasa}
          onClose={() => setSheet(null)}
          onEditar={onEditar}
          onReponer={onReponer}
          onGasto={onGasto}
          onNuevaCategoria={onNuevaCategoria}
        />
      )}
    </>
  )
}

/* Selector de categoría reutilizable (elige existente o crea nueva) */
function CategoriaSelector({ categorias, value, onChange, onNuevaCategoria }) {
  const [creando, setCreando] = useState(false)
  const [nueva, setNueva] = useState('')

  const crear = () => {
    const n = nueva.trim()
    if (!n) return
    onNuevaCategoria(n)
    onChange(n)
    setNueva(''); setCreando(false)
  }

  return (
    <div>
      <div className="chips" style={{ flexWrap: 'wrap', overflow: 'visible' }}>
        {categorias.map((c) => (
          <button key={c} className={`chip ${value === c ? 'active' : ''}`} onClick={() => onChange(c)}>{c}</button>
        ))}
        <button className="chip" onClick={() => setCreando((v) => !v)}>+ Nueva</button>
      </div>
      {creando && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input className="input" placeholder="Nombre de la categoría" value={nueva} onChange={(e) => setNueva(e.target.value)} />
          <button className="btn" style={{ width: 'auto', padding: '0 18px' }} onClick={crear}>Crear</button>
        </div>
      )}
    </div>
  )
}

function NuevoProducto({ categorias, onClose, onAdd, onNuevaCategoria }) {
  const [nombre, setNombre] = useState('')
  const [cat, setCat] = useState(categorias[0] || '')
  const [precio, setPrecio] = useState('')
  const [moneda, setMoneda] = useState('USD')
  const [cantidad, setCantidad] = useState('')
  const [minimo, setMinimo] = useState('5')
  const [foto, setFoto] = useState(null)

  const guardar = () => {
    if (!nombre || !precio) return
    onAdd({
      nombre,
      icon: 'box',
      unidad: 'Unidad',
      cat: cat || 'Sin categoría',
      precio: parseFloat(precio.replace(',', '.')) || 0,
      moneda,
      stock: parseInt(cantidad) || 0,
      minimo: parseInt(minimo) || 0,
      foto_url: foto,
    })
    onClose()
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h3>Nuevo producto</h3>
          <button className="icon-btn" onClick={onClose}><Close size={22} /></button>
        </div>

        <div className="field">
          <label>Foto (opcional)</label>
          <FotoPicker foto={foto} onFoto={setFoto} />
        </div>

        <div className="field">
          <label>Nombre</label>
          <input className="input" placeholder="Ej: Harina P.A.N." value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>

        <div className="field">
          <label>Categoría</label>
          <CategoriaSelector categorias={categorias} value={cat} onChange={setCat} onNuevaCategoria={onNuevaCategoria} />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Precio</label>
            <input className="input" inputMode="decimal" placeholder="0.00" value={precio} onChange={(e) => setPrecio(e.target.value)} />
          </div>
          <div className="field">
            <label>Moneda</label>
            <div className="toggle">
              <button className={moneda === 'USD' ? 'on' : ''} onClick={() => setMoneda('USD')}>$</button>
              <button className={moneda === 'VES' ? 'on' : ''} onClick={() => setMoneda('VES')}>Bs</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Cantidad</label>
            <input className="input" inputMode="numeric" placeholder="0" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Avísame cuando queden</label>
            <input className="input" inputMode="numeric" placeholder="5" value={minimo} onChange={(e) => setMinimo(e.target.value)} />
          </div>
        </div>

        <button className="btn" onClick={guardar} style={{ marginTop: 6 }}>Guardar producto</button>
      </div>
    </div>
  )
}

function FichaProducto({ producto, categorias, tasa, onClose, onEditar, onReponer, onGasto, onNuevaCategoria }) {
  const [modo, setModo] = useState('ver') // 'ver' | 'editar'
  const [qty, setQty] = useState('')
  const [pasoGasto, setPasoGasto] = useState(false)
  const [monto, setMonto] = useState('')
  const [moneda, setMoneda] = useState('USD')

  // Estado edición
  const [e, setE] = useState({ nombre: producto.nombre, cat: producto.cat, precio: String(producto.precio), moneda: producto.moneda, minimo: String(producto.minimo), foto_url: producto.foto_url || null })

  const reponer = () => {
    const n = parseInt(qty)
    if (!n || n <= 0) return
    onReponer(producto.id, n)
    setQty('')
    setPasoGasto(true) // preguntar si registrar el gasto
  }

  const guardarGasto = () => {
    const m = parseFloat(String(monto).replace(',', '.'))
    if (m > 0) onGasto({ usd: moneda === 'USD' ? m : m / tasa, cat: 'Inventario', desc: `Compra: ${producto.nombre}` })
    onClose()
  }

  const guardarEdicion = () => {
    onEditar(producto.id, {
      nombre: e.nombre,
      cat: e.cat,
      precio: parseFloat(e.precio.replace(',', '.')) || 0,
      moneda: e.moneda,
      minimo: parseInt(e.minimo) || 0,
      foto_url: e.foto_url,
    })
    onClose()
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(ev) => ev.stopPropagation()}>
        <div className="sheet-head">
          <h3>{modo === 'editar' ? 'Editar producto' : producto.nombre}</h3>
          <button className="icon-btn" onClick={onClose}><Close size={22} /></button>
        </div>

        {/* PASO: preguntar por el gasto tras reponer */}
        {pasoGasto ? (
          <div>
            <div className="card" style={{ padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Stock actualizado ✓</div>
              <div className="muted tiny">¿Quieres registrar el gasto de esta compra de mercancía?</div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="field" style={{ flex: 1 }}>
                <label>Monto pagado</label>
                <input className="input" inputMode="decimal" placeholder="0.00" value={monto} onChange={(ev) => setMonto(ev.target.value)} autoFocus />
              </div>
              <div className="field">
                <label>Moneda</label>
                <div className="toggle">
                  <button className={moneda === 'USD' ? 'on' : ''} onClick={() => setMoneda('USD')}>$</button>
                  <button className={moneda === 'VES' ? 'on' : ''} onClick={() => setMoneda('VES')}>Bs</button>
                </div>
              </div>
            </div>
            <button className="btn cyan" onClick={guardarGasto}><Check size={20} /> Registrar gasto</button>
            <button className="btn ghost" style={{ marginTop: 10 }} onClick={onClose}>No, gracias</button>
          </div>
        ) : modo === 'editar' ? (
          <div>
            <div className="field">
              <label>Foto</label>
              <FotoPicker foto={e.foto_url} onFoto={(url) => setE({ ...e, foto_url: url })} />
            </div>
            <div className="field">
              <label>Nombre</label>
              <input className="input" value={e.nombre} onChange={(ev) => setE({ ...e, nombre: ev.target.value })} />
            </div>
            <div className="field">
              <label>Categoría</label>
              <CategoriaSelector categorias={categorias} value={e.cat} onChange={(c) => setE({ ...e, cat: c })} onNuevaCategoria={onNuevaCategoria} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="field" style={{ flex: 1 }}>
                <label>Precio</label>
                <input className="input" inputMode="decimal" value={e.precio} onChange={(ev) => setE({ ...e, precio: ev.target.value })} />
              </div>
              <div className="field">
                <label>Moneda</label>
                <div className="toggle">
                  <button className={e.moneda === 'USD' ? 'on' : ''} onClick={() => setE({ ...e, moneda: 'USD' })}>$</button>
                  <button className={e.moneda === 'VES' ? 'on' : ''} onClick={() => setE({ ...e, moneda: 'VES' })}>Bs</button>
                </div>
              </div>
            </div>
            <div className="field">
              <label>Avísame cuando queden</label>
              <input className="input" inputMode="numeric" value={e.minimo} onChange={(ev) => setE({ ...e, minimo: ev.target.value })} />
            </div>
            <button className="btn" onClick={guardarEdicion}><Check size={20} /> Guardar cambios</button>
            <button className="btn ghost" style={{ marginTop: 10 }} onClick={() => setModo('ver')}>Cancelar</button>
          </div>
        ) : (
          <div>
            {/* Resumen del producto */}
            <div className="card" style={{ padding: 16, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div className="ficha-thumb"><Miniatura producto={producto} size={30} /></div>
                <div>
                  <div className="muted tiny">Disponible</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 26, color: producto.stock <= producto.minimo ? 'var(--error)' : 'var(--on-surface)' }}>
                    {producto.stock} <span style={{ fontSize: 15, fontWeight: 500 }}>u</span>
                  </div>
                </div>
              </div>
              <div className="dual">
                <div className="u" style={{ color: 'var(--primary)' }}>{fmtUSD(enUSD(producto, tasa))}</div>
                <div className="b">{fmtBs(enBs(producto, tasa))}</div>
              </div>
            </div>

            {/* Reponer stock */}
            <div className="label-caps muted" style={{ marginBottom: 8 }}>Reponer stock (llegó mercancía)</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <input className="input" inputMode="numeric" placeholder="Cantidad que llegó" value={qty} onChange={(ev) => setQty(ev.target.value.replace(/\D/g, ''))} style={{ flex: 1 }} />
              <button className="btn" style={{ width: 'auto', padding: '0 22px' }} onClick={reponer}><Plus size={20} /> Reponer</button>
            </div>

            <button className="btn ghost" onClick={() => setModo('editar')}><Edit size={18} /> Editar producto</button>
          </div>
        )}
      </div>
    </div>
  )
}
