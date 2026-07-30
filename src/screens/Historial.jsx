import { useMemo, useState } from 'react'
import { Share, Sell, Cash, ChevronLeft, ChevronRight, Calendar } from '../icons.jsx'
import { metodoLabel } from '../mock.js'
import { fmtUSD, fmtBs } from '../format.js'
import { todayISO, monthKey, mesLabel, shiftMonth, shiftDay, fechaLarga } from '../dates.js'

// Totales de una lista usando la tasa guardada de cada registro
function totales(list, tasaHoy) {
  const v = list.filter((a) => a.tipo === 'venta')
  const g = list.filter((a) => a.tipo === 'gasto')
  const ventasUsd = v.reduce((s, a) => s + a.usd, 0)
  const gastosUsd = g.reduce((s, a) => s + a.usd, 0)
  const ventasBs = v.reduce((s, a) => s + a.usd * (a.tasa || tasaHoy), 0)
  const gastosBs = g.reduce((s, a) => s + a.usd * (a.tasa || tasaHoy), 0)
  return { ventasUsd, gastosUsd, balanceUsd: ventasUsd - gastosUsd, ventasBs, gastosBs, balanceBs: ventasBs - gastosBs }
}

export default function Historial({ tasa, actividad, onToast }) {
  const hoy = todayISO()
  const [modo, setModo] = useState('dia') // 'dia' | 'mes'
  const [diaSel, setDiaSel] = useState(hoy)
  const [mes, setMes] = useState(monthKey(hoy))
  const [abierta, setAbierta] = useState(null)

  const actMes = useMemo(() => actividad.filter((a) => monthKey(a.fecha) === mes), [actividad, mes])
  const diasDelMes = useMemo(() => [...new Set(actMes.map((a) => a.fecha))].sort((a, b) => b.localeCompare(a)), [actMes])
  const registrosDia = actividad.filter((a) => a.fecha === diaSel)

  const tMes = totales(actMes, tasa)
  const tDia = totales(registrosDia, tasa)

  const irDia = (delta) => { const n = shiftDay(diaSel, delta); setDiaSel(n); setMes(monthKey(n)) }
  const irMes = (delta) => setMes(shiftMonth(mes, delta))
  const saltarAFecha = (iso) => { if (!iso) return; setDiaSel(iso); setMes(monthKey(iso)); setModo('dia') }
  const verDia = (f) => { setDiaSel(f); setModo('dia') }

  const compartir = async () => {
    const t = modo === 'dia' ? tDia : tMes
    const titulo = modo === 'dia' ? fechaLarga(diaSel) : mesLabel(mes)
    const txt = `Tú Bodega Online\n${titulo}\nVentas: ${fmtUSD(t.ventasUsd)}\nGastos: ${fmtUSD(t.gastosUsd)}\nBalance: ${fmtUSD(t.balanceUsd)}`
    try {
      if (navigator.share) { await navigator.share({ title: 'Resumen', text: txt }); onToast?.('Resumen compartido') }
      else { await navigator.clipboard.writeText(txt); onToast?.('Resumen copiado') }
    } catch (e) {
      if (e && e.name === 'AbortError') return
      try { await navigator.clipboard.writeText(txt); onToast?.('Resumen copiado') } catch {}
    }
  }

  return (
    <>
      <div className="app-header">
        <div style={{ width: 40 }} />
        <span className="brand" style={{ fontSize: 20 }}>Historial</span>
        <button className="icon-btn" aria-label="Compartir resumen" onClick={compartir}><Share size={20} /></button>
      </div>
      <div className="screen">
        {/* Selector Por día / Por mes */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div className="toggle">
            <button className={modo === 'dia' ? 'on' : ''} onClick={() => setModo('dia')}>Por día</button>
            <button className={modo === 'mes' ? 'on' : ''} onClick={() => { setMes(monthKey(diaSel)); setModo('mes') }}>Por mes</button>
          </div>
        </div>

        {/* Navegador (día o mes) + ir a fecha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 4, flex: 1 }}>
            <button className="icon-btn" onClick={() => (modo === 'dia' ? irDia(-1) : irMes(-1))} aria-label="Anterior"><ChevronLeft size={20} /></button>
            <div style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-head)', fontWeight: 700, textTransform: 'capitalize', fontSize: modo === 'dia' ? 15 : 16 }}>
              {modo === 'dia' ? fechaLarga(diaSel) : mesLabel(mes)}
            </div>
            <button className="icon-btn" onClick={() => (modo === 'dia' ? irDia(1) : irMes(1))} aria-label="Siguiente"><ChevronRight size={20} /></button>
          </div>
          <label className="icon-btn" style={{ background: 'var(--container)', color: 'var(--primary)', width: 48, height: 48, borderRadius: 14, cursor: 'pointer', position: 'relative' }} aria-label="Ir a fecha">
            <Calendar size={22} />
            <input type="date" value={diaSel} onChange={(e) => saltarAFecha(e.target.value)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
          </label>
        </div>

        {modo === 'dia' ? (
          <>
            <ResumenCard titulo="Balance del día" t={tDia} />
            {registrosDia.length === 0 ? (
              <div className="card" style={{ marginTop: 12 }}><div className="empty">Sin movimientos este día.</div></div>
            ) : (
              <div className="card list" style={{ marginTop: 12 }}>
                {registrosDia.map((a) => (
                  <ActividadRow key={a.id} a={a} tasa={tasa} abierta={abierta} setAbierta={setAbierta} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <ResumenCard titulo={`Resumen de ${mesLabel(mes)}`} t={tMes} />
            <div className="h-section" style={{ margin: '18px 0 10px' }}>Días con movimiento</div>
            {diasDelMes.length === 0 ? (
              <div className="card"><div className="empty">No hubo movimientos este mes.</div></div>
            ) : (
              <div className="card list">
                {diasDelMes.map((f) => {
                  const t = totales(actividad.filter((a) => a.fecha === f), tasa)
                  return (
                    <button key={f} className="row" onClick={() => verDia(f)} style={{ width: '100%', textAlign: 'left', background: 'none' }}>
                      <div className="left">
                        <div className="avatar thumb" style={{ color: 'var(--primary)' }}><Calendar size={20} /></div>
                        <div>
                          <div className="name" style={{ textTransform: 'capitalize' }}>{fechaLarga(f)}</div>
                          <div className="sub">Ventas {fmtUSD(t.ventasUsd)} · Gastos {fmtUSD(t.gastosUsd)}</div>
                        </div>
                      </div>
                      <div className="dual">
                        <div className={t.balanceUsd >= 0 ? 'amount-pos' : 'amount-neg'}>{fmtUSD(t.balanceUsd)}</div>
                        <ChevronRight size={16} color="var(--outline)" />
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

function ResumenCard({ titulo, t }) {
  return (
    <>
      <div className="card" style={{ padding: 18, textAlign: 'center', marginBottom: 12 }}>
        <div className="label-caps muted">{titulo}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 30, color: t.balanceUsd >= 0 ? 'var(--income)' : 'var(--error)' }}>{fmtUSD(t.balanceUsd)}</div>
        <div className="price-sub">{fmtBs(t.balanceBs)}</div>
      </div>
      <div className="stat-grid">
        <div className="card stat income">
          <div className="top muted">Ventas</div>
          <div className="price">{fmtUSD(t.ventasUsd)}</div>
          <div className="price-sub">{fmtBs(t.ventasBs)}</div>
        </div>
        <div className="card stat expense">
          <div className="top muted">Gastos</div>
          <div className="price">{fmtUSD(t.gastosUsd)}</div>
          <div className="price-sub">{fmtBs(t.gastosBs)}</div>
        </div>
      </div>
    </>
  )
}

function ActividadRow({ a, tasa, abierta, setAbierta }) {
  return (
    <div>
      <div className="row" style={{ cursor: a.tipo === 'venta' ? 'pointer' : 'default' }} onClick={() => a.tipo === 'venta' && setAbierta(abierta === a.id ? null : a.id)}>
        <div className="left">
          <div className="avatar" style={{ background: a.tipo === 'venta' ? 'var(--container)' : '#fef3c7', color: a.tipo === 'venta' ? 'var(--primary)' : 'var(--expense)' }}>
            {a.tipo === 'venta' ? <Sell size={20} /> : <Cash size={20} />}
          </div>
          <div>
            <div className="name">{a.tipo === 'venta' ? `Venta #${a.numero}` : a.desc}</div>
            <div className="sub">{a.hora} • {a.tipo === 'venta' ? metodoLabel(a.metodo) + (a.ref4 ? ` ••${a.ref4}` : '') : a.cat}</div>
          </div>
        </div>
        <div className="dual">
          <div className={a.tipo === 'venta' ? 'amount-pos' : 'amount-neg'}>{a.tipo === 'venta' ? '+' : '−'}{fmtUSD(a.usd)}</div>
          <div className="price-sub">{fmtBs(a.usd * (a.tasa || tasa))}</div>
        </div>
      </div>
      {abierta === a.id && a.items && (
        <div style={{ padding: '0 14px 12px 68px' }}>
          {a.items.map((it, k) => (
            <div key={k} className="sub" style={{ padding: '3px 0' }}>• {it}</div>
          ))}
        </div>
      )}
    </div>
  )
}
