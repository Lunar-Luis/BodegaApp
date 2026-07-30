import { useState, useRef, useLayoutEffect } from 'react'
import Header from '../components/Header.jsx'
import { Search, Plus, Minus, Sell, Cash, DollarBill, Phone, Close, Check } from '../icons.jsx'
import { Miniatura } from './Productos.jsx'
import { fmtUSD, fmtBs, enUSD, enBs } from '../format.js'
import { METODOS } from '../mock.js'

export default function Vender({ tasa, productos, categorias = [], onCobrar }) {
  const [q, setQ] = useState('')
  const [filtroCat, setFiltroCat] = useState('Todos')
  const [carrito, setCarrito] = useState([]) // {id, nombre, qty, ...}
  const [pagando, setPagando] = useState(false)

  // Medir la altura real del carrito para dejar espacio y poder bajar hasta el último producto
  const cartRef = useRef(null)
  const [cartH, setCartH] = useState(0)
  useLayoutEffect(() => {
    setCartH(carrito.length ? cartRef.current?.offsetHeight || 0 : 0)
  }, [carrito])

  // Ordenados por más vendidos (para que lo que más sale quede de primero)
  const lista = productos
    .filter((p) => p.nombre.toLowerCase().includes(q.toLowerCase()) && (filtroCat === 'Todos' || p.cat === filtroCat))
    .sort((a, b) => (b.vendidos || 0) - (a.vendidos || 0))

  const sinBusqueda = !q && filtroCat === 'Todos'
  const getQty = (id) => carrito.find((c) => c.id === id)?.qty || 0

  const cambiar = (prod, delta) => {
    setCarrito((prev) => {
      const ex = prev.find((c) => c.id === prod.id)
      if (!ex) {
        if (delta < 0) return prev
        return [...prev, { ...prod, qty: 1 }]
      }
      const q = ex.qty + delta
      if (q <= 0) return prev.filter((c) => c.id !== prod.id)
      return prev.map((c) => (c.id === prod.id ? { ...c, qty: Math.min(q, prod.stock) } : c))
    })
  }

  const totalUSD = carrito.reduce((s, c) => s + enUSD(c, tasa) * c.qty, 0)
  const totalItems = carrito.reduce((s, c) => s + c.qty, 0)

  const confirmarPago = (metodo, ref4) => {
    onCobrar(carrito, totalUSD, metodo, ref4)
    setCarrito([])
    setPagando(false)
  }

  return (
    <>
      <Header />
      <div className="screen" style={{ paddingBottom: carrito.length ? cartH + 120 : 120 }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <span style={{ position: 'absolute', left: 14, top: 15, color: 'var(--outline)' }}><Search size={20} /></span>
          <input className="input" style={{ paddingLeft: 44 }} placeholder="Buscar producto..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <div className="chips" style={{ marginBottom: 4 }}>
          {['Todos', ...categorias].map((c) => (
            <button key={c} className={`chip ${filtroCat === c ? 'active' : ''}`} onClick={() => setFiltroCat(c)}>{c}</button>
          ))}
        </div>

        {sinBusqueda && <div className="label-caps muted" style={{ margin: '6px 2px 8px' }}>Más vendidos primero</div>}

        <div className="sell-grid">
          {lista.map((p) => {
            const qty = getQty(p.id)
            const agotado = p.stock <= 0
            return (
              <div className={`card sell-tile ${qty ? 'in' : ''}`} key={p.id}>
                <div className="thumb-lg">
                  <Miniatura producto={p} size={34} />
                </div>
                <div className="pname">{p.nombre}</div>
                <div className="price-row">
                  <div style={{ minWidth: 0 }}>
                    <span className="u" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>{fmtUSD(enUSD(p, tasa))}</span>
                    <div className="b" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--outline)' }}>{fmtBs(enBs(p, tasa))}</div>
                  </div>
                  <span className="tile-stock" data-low={p.stock <= p.minimo}>{p.stock} disp.</span>
                </div>
                {qty ? (
                  <div className="stepper">
                    <button onClick={() => cambiar(p, -1)}><Minus size={18} /></button>
                    <span className="qn">{qty}</span>
                    <button onClick={() => cambiar(p, +1)}><Plus size={18} /></button>
                  </div>
                ) : (
                  <button className="add-mini" onClick={() => cambiar(p, +1)} disabled={agotado} style={agotado ? { opacity: .5 } : null}>
                    {agotado ? 'Agotado' : '+ Agregar'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {carrito.length > 0 && (
        <div className="cart-bar">
          <div className="cart-inner" ref={cartRef}>
            {carrito.map((c) => (
              <div className="cart-line" key={c.id}>
                <span>{c.qty}× {c.nombre}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{fmtUSD(enUSD(c, tasa) * c.qty)}</span>
              </div>
            ))}
            <div className="cart-total">
              <span className="label-caps muted">{totalItems} artículo{totalItems !== 1 ? 's' : ''} · Total</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 22, color: 'var(--primary)' }}>{fmtUSD(totalUSD)}</div>
                <div className="price-sub">{fmtBs(totalUSD * tasa)}</div>
              </div>
            </div>
            <button className="btn sell" onClick={() => setPagando(true)}><Sell size={22} /> Cobrar {fmtUSD(totalUSD)}</button>
            <div className="muted tiny" style={{ textAlign: 'center', marginTop: 8 }}>El inventario se descuenta automáticamente</div>
          </div>
        </div>
      )}

      {pagando && (
        <PagoSheet totalUSD={totalUSD} tasa={tasa} onClose={() => setPagando(false)} onConfirm={confirmarPago} />
      )}
    </>
  )
}

function PagoSheet({ totalUSD, tasa, onClose, onConfirm }) {
  const [metodo, setMetodo] = useState('efectivo_usd')
  const [ref4, setRef4] = useState('')

  const iconOf = (id) => (id === 'pago_movil' ? Phone : id === 'efectivo_usd' ? DollarBill : Cash)
  const montoMetodo = metodo === 'efectivo_usd' ? fmtUSD(totalUSD) : fmtBs(totalUSD * tasa)
  const ref4Ok = metodo !== 'pago_movil' || ref4.length === 4

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h3>Cobrar</h3>
          <button className="icon-btn" onClick={onClose}><Close size={22} /></button>
        </div>

        <div className="card" style={{ padding: 16, textAlign: 'center', marginBottom: 16 }}>
          <div className="label-caps muted">Total a cobrar</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 30, color: 'var(--primary)' }}>{fmtUSD(totalUSD)}</div>
          <div className="price-sub">{fmtBs(totalUSD * tasa)}</div>
        </div>

        <div className="label-caps muted" style={{ marginBottom: 8 }}>Forma de pago</div>
        <div className="cat-grid">
          {METODOS.map((m) => {
            const Icon = iconOf(m.id)
            return (
              <button key={m.id} className={`cat ${metodo === m.id ? 'on' : ''}`} onClick={() => setMetodo(m.id)}>
                <span className="ci"><Icon size={22} /></span>
                {m.label}
              </button>
            )
          })}
        </div>

        {metodo === 'pago_movil' && (
          <div className="field" style={{ marginTop: 16 }}>
            <label>Últimos 4 dígitos de la referencia</label>
            <input
              className="input"
              inputMode="numeric"
              maxLength={4}
              placeholder="Ej: 4821"
              value={ref4}
              onChange={(e) => setRef4(e.target.value.replace(/\D/g, '').slice(0, 4))}
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '.3em', textAlign: 'center', fontSize: 22 }}
            />
          </div>
        )}

        <button
          className="btn sell"
          style={{ marginTop: 18, opacity: ref4Ok ? 1 : 0.5 }}
          disabled={!ref4Ok}
          onClick={() => onConfirm(metodo, ref4)}
        >
          <Check size={22} /> Cobrar {montoMetodo}
        </button>
      </div>
    </div>
  )
}
