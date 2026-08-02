import { useState } from 'react'
import Header from '../components/Header.jsx'
import { Box, Invest, Cash, Calendar, Note, Check } from '../icons.jsx'
import { todayISO } from '../dates.js'
import { fmtUSD, fmtBs } from '../format.js'

const CATS = [
  { id: 'Inventario', Icon: Box },
  { id: 'Inversión', Icon: Invest },
  { id: 'Gasto', Icon: Cash },
]

export default function Gastos({ tasa, actividad, onGuardar, onRefrescar }) {
  const [monto, setMonto] = useState('')
  const [moneda, setMoneda] = useState('USD')
  const [cat, setCat] = useState('Inventario')
  const [nota, setNota] = useState('')

  const gastosHoy = actividad.filter((a) => a.tipo === 'gasto' && a.fecha === todayISO())

  const guardar = () => {
    const m = parseFloat(String(monto).replace(',', '.'))
    if (!m) return
    const usd = moneda === 'USD' ? m : m / tasa
    onGuardar({ usd, cat, desc: nota || cat })
    setMonto(''); setNota('')
  }

  const montoNum = parseFloat(String(monto).replace(',', '.')) || 0
  const equivalente = moneda === 'USD' ? montoNum * tasa : montoNum / tasa

  return (
    <>
      <Header title="Gastos" onRefresh={onRefrescar} />
      <div className="screen">
        {/* Monto */}
        <div className="card" style={{ padding: 18, textAlign: 'center', marginBottom: 16 }}>
          <div className="label-caps muted">Monto</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: 'var(--outline-variant)' }}>{moneda === 'USD' ? '$' : 'Bs'}</span>
            <input
              className="input big-amount"
              style={{ maxWidth: 200 }}
              inputMode="decimal"
              placeholder="0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
          </div>
          <div className="price-sub" style={{ marginBottom: 10 }}>
            {montoNum > 0 && (moneda === 'USD' ? fmtBs(equivalente) : fmtUSD(equivalente))}
          </div>
          <div className="toggle">
            <button className={moneda === 'USD' ? 'on' : ''} onClick={() => setMoneda('USD')}>USD</button>
            <button className={moneda === 'VES' ? 'on' : ''} onClick={() => setMoneda('VES')}>Bs</button>
          </div>
        </div>

        {/* Categoría */}
        <div className="label-caps muted" style={{ marginBottom: 8 }}>Categoría</div>
        <div className="cat-grid">
          {CATS.map(({ id, Icon }) => (
            <button key={id} className={`cat ${cat === id ? 'on' : ''}`} onClick={() => setCat(id)}>
              <span className="ci"><Icon size={22} /></span>
              {id}
            </button>
          ))}
        </div>

        {/* Fecha + nota */}
        <div className="card" style={{ padding: 14, margin: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Calendar size={20} color="var(--primary)" /> Fecha</span>
          <span className="chip active">Hoy</span>
        </div>

        <div className="field">
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: 17, color: 'var(--outline)' }}><Note size={18} /></span>
            <input className="input" style={{ paddingLeft: 42 }} placeholder="Nota opcional..." value={nota} onChange={(e) => setNota(e.target.value)} />
          </div>
        </div>

        <button className="btn cyan" onClick={guardar}><Check size={20} /> Guardar gasto</button>

        {/* Gastos de hoy */}
        <div className="section">
          <div className="h-section" style={{ marginBottom: 10 }}>Gastos de hoy</div>
          <div className="card list">
            {gastosHoy.map((g) => (
              <div className="row" key={g.id}>
                <div className="left">
                  <div className="avatar" style={{ background: '#fef3c7', color: 'var(--expense)' }}><Cash size={20} /></div>
                  <div>
                    <div className="name">{g.desc}</div>
                    <div className="sub">{g.cat} · {g.hora}</div>
                  </div>
                </div>
                <div className="dual">
                  <div className="amount-neg">−{fmtUSD(g.usd)}</div>
                  <div className="price-sub">{fmtBs(g.usd * tasa)}</div>
                </div>
              </div>
            ))}
            {gastosHoy.length === 0 && <div className="empty">Aún no hay gastos hoy.</div>}
          </div>
        </div>
      </div>
    </>
  )
}
