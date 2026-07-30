import Header from '../components/Header.jsx'
import { Up, Down, Warning, Edit, Sell, Cash, DollarBill, Phone, Sun, Moon, LogOut } from '../icons.jsx'
import { fmtUSD, fmtBs } from '../format.js'
import { metodoLabel } from '../mock.js'
import { todayISO } from '../dates.js'

export default function Inicio({ tasa, setTasa, productos, actividad, stockBajo, tema, alternarTema, onLogout }) {
  const hoy = new Date().toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long' })

  const hoyISO = todayISO()
  const actHoy = actividad.filter((a) => a.fecha === hoyISO)
  const ventas = actHoy.filter((a) => a.tipo === 'venta')
  const ventasHoy = ventas.reduce((s, a) => s + a.usd, 0)
  const gastosHoy = actHoy.filter((a) => a.tipo === 'gasto').reduce((s, a) => s + a.usd, 0)
  const ganancia = ventasHoy - gastosHoy

  // Resumen de caja por método de pago
  const efectivoUSD = ventas.filter((a) => a.metodo === 'efectivo_usd').reduce((s, a) => s + a.usd, 0)
  const efectivoBs = ventas.filter((a) => a.metodo === 'efectivo_bs').reduce((s, a) => s + a.usd * (a.tasa || tasa), 0)
  const pagoMovil = ventas.filter((a) => a.metodo === 'pago_movil').reduce((s, a) => s + a.usd * (a.tasa || tasa), 0)

  const editarTasa = () => {
    const v = window.prompt('Tasa del día (Bs por $):', String(tasa))
    if (v && !isNaN(parseFloat(v.replace(',', '.')))) setTasa(parseFloat(v.replace(',', '.')))
  }

  return (
    <>
      <Header
        right={
          <button className="icon-btn" onClick={alternarTema} aria-label="Cambiar tema">
            {tema === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        }
      />
      <div className="screen">
        {/* Saludo + tasa */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div className="h-greet">Hola</div>
            <div className="muted tiny" style={{ textTransform: 'capitalize' }}>{hoy}</div>
          </div>
          <button className="rate-chip" onClick={editarTasa}>
            <span className="label-caps muted">Tasa</span>
            <b>Bs {tasa.toLocaleString('es-VE')} / $</b>
            <Edit size={15} color="#7c7488" />
          </button>
        </div>

        {/* Ganancia de hoy */}
        <div className="hero">
          <div className="blob1" />
          <div className="blob2" />
          <div className="cap">Ganancia de hoy</div>
          <div className="big">{fmtUSD(ganancia)}</div>
          <div className="bs">{fmtBs(ganancia * tasa)}</div>
        </div>

        {/* Ventas / Gastos */}
        <div className="stat-grid section">
          <div className="card stat income">
            <div className="top muted">
              <span className="badge income"><Up size={16} /></span> Ventas de hoy
            </div>
            <div className="price">{fmtUSD(ventasHoy)}</div>
            <div className="price-sub">{fmtBs(ventasHoy * tasa)}</div>
          </div>
          <div className="card stat expense">
            <div className="top muted">
              <span className="badge expense"><Down size={16} /></span> Gastos de hoy
            </div>
            <div className="price">{fmtUSD(gastosHoy)}</div>
            <div className="price-sub">{fmtBs(gastosHoy * tasa)}</div>
          </div>
        </div>

        {/* Resumen de caja por método de pago */}
        <div className="section">
          <h3 className="h-section" style={{ marginBottom: 10 }}>Resumen de caja</h3>
          <div className="card list">
            <div className="row">
              <div className="left">
                <div className="avatar" style={{ background: 'var(--income-bg)', color: 'var(--income)' }}><DollarBill size={20} /></div>
                <div className="name">Efectivo $</div>
              </div>
              <div className="dual"><div className="u">{fmtUSD(efectivoUSD)}</div></div>
            </div>
            <div className="row">
              <div className="left">
                <div className="avatar" style={{ background: 'var(--container)', color: 'var(--primary)' }}><Cash size={20} /></div>
                <div className="name">Efectivo Bs</div>
              </div>
              <div className="dual"><div className="u">{fmtBs(efectivoBs)}</div></div>
            </div>
            <div className="row">
              <div className="left">
                <div className="avatar" style={{ background: '#e0f2fe', color: 'var(--secondary)' }}><Phone size={20} /></div>
                <div className="name">Pago móvil</div>
              </div>
              <div className="dual"><div className="u">{fmtBs(pagoMovil)}</div></div>
            </div>
          </div>
        </div>

        {/* Stock bajo */}
        {stockBajo.length > 0 && (
          <div className="section">
            <h3 className="h-section" style={{ color: 'var(--error)', display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
              <Warning size={18} /> Stock bajo
            </h3>
            <div className="alert-chips">
              {stockBajo.map((p) => (
                <div className="alert-chip" key={p.id}>
                  {p.nombre}
                  <span className="n">{p.stock} {p.unidad === 'Kg' ? 'kg' : 'u'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actividad reciente */}
        <div className="section">
          <div className="section-head">
            <h3 className="h-section">Actividad reciente</h3>
            <span className="link">Ver todo</span>
          </div>
          <div className="card list">
            {actHoy.length === 0 && <div className="empty">Aún no hay movimientos hoy.</div>}
            {actHoy.slice(0, 4).map((a) => (
              <div className="row" key={a.id}>
                <div className="left">
                  <div className="avatar" style={{ background: a.tipo === 'venta' ? 'var(--container)' : '#fef3c7', color: a.tipo === 'venta' ? 'var(--primary)' : 'var(--expense)' }}>
                    {a.tipo === 'venta' ? <Sell size={20} /> : <Cash size={20} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="name">{a.tipo === 'venta' ? `Venta #${a.numero}` : a.desc}</div>
                    <div className="sub">{a.hora} • {a.tipo === 'venta' ? metodoLabel(a.metodo) + (a.ref4 ? ` ••${a.ref4}` : '') : a.cat}</div>
                  </div>
                </div>
                <div className="dual">
                  <div className={a.tipo === 'venta' ? 'amount-pos' : 'amount-neg'}>
                    {a.tipo === 'venta' ? '+' : '−'}{fmtUSD(a.usd)}
                  </div>
                  <div className="price-sub">{fmtBs(a.usd * (a.tasa || tasa))}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}><LogOut size={17} /> Cerrar sesión</button>
      </div>
    </>
  )
}
