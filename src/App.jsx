import { useEffect, useMemo, useRef, useState } from 'react'
import * as db from './db.js'
import { supabase } from './supabase.js'
import { todayISO } from './dates.js'
import { guardarCache, leerCache, leerCola, guardarCola, encolar, uid } from './local.js'
import { Home, Inventory, Sell, Payments, History } from './icons.jsx'
import Inicio from './screens/Inicio.jsx'
import Productos from './screens/Productos.jsx'
import Vender from './screens/Vender.jsx'
import Gastos from './screens/Gastos.jsx'
import Historial from './screens/Historial.jsx'
import Login from './screens/Login.jsx'

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = verificando, null = sin sesión
  const [tab, setTab] = useState('inicio')
  const [tasa, setTasaState] = useState(42.5)
  const [productos, setProductos] = useState([])
  const [actividad, setActividad] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [toast, setToast] = useState(null)
  const [tema, setTema] = useState(() => localStorage.getItem('tema') || 'light')
  const [online, setOnline] = useState(navigator.onLine)
  const [pendientes, setPendientes] = useState(() => leerCola().length)
  const sincronizando = useRef(false)
  const sincronizarRef = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema)
    localStorage.setItem('tema', tema)
  }, [tema])
  const alternarTema = () => setTema((t) => (t === 'dark' ? 'light' : 'dark'))

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  // Cargar / refrescar todo desde Supabase (con manejo de "sin conexión")
  const refrescar = async () => {
    try {
      const d = await db.cargarTodo()
      setProductos(d.productos)
      setActividad(d.actividad)
      setCategorias(d.categorias)
      setTasaState(d.tasa)
      setOnline(true)
      return true
    } catch (e) {
      setOnline(false) // sin conexión: se mantienen los datos en caché
      return false
    }
  }

  // Sube a la nube las ventas/gastos que quedaron en cola (hechos sin internet)
  const sincronizar = async () => {
    if (sincronizando.current || !navigator.onLine) return
    let cola = leerCola()
    if (!cola.length) return
    sincronizando.current = true
    for (const op of [...cola]) {
      try {
        let res
        if (op.tipo === 'venta') res = await db.crearVenta(op.payload.venta, op.payload.carrito, op.payload.venta.tasa)
        else if (op.tipo === 'gasto') res = await db.crearGasto(op.payload.gasto)
        if (res && res.error) throw res.error
        cola = leerCola().filter((x) => x.id !== op.id)
        guardarCola(cola)
        setPendientes(cola.length)
      } catch (e) {
        break // sigue sin conexión / error → se reintenta después
      }
    }
    sincronizando.current = false
    if (leerCola().length === 0) await refrescar()
  }
  sincronizarRef.current = sincronizar

  // Control de sesión (login compartido)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const cerrarSesion = () => supabase.auth.signOut()

  // Al entrar: muestra primero la copia local (sirve sin internet), luego actualiza y sincroniza
  useEffect(() => {
    if (!session) return
    const c = leerCache()
    if (c) {
      setProductos(c.productos || [])
      setActividad(c.actividad || [])
      setCategorias(c.categorias || [])
      setTasaState(c.tasa ?? 42.5)
    }
    setCargando(true)
    refrescar().finally(() => { setCargando(false); sincronizar() })
  }, [session])

  // Guardar copia local de los datos (para verlos sin internet)
  useEffect(() => {
    if (!cargando && session) guardarCache({ productos, actividad, categorias, tasa })
  }, [productos, actividad, categorias, tasa, cargando, session])

  // Detectar cuando vuelve/ se va el internet
  useEffect(() => {
    const goOnline = () => { setOnline(true); sincronizarRef.current && sincronizarRef.current() }
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => { window.removeEventListener('online', goOnline); window.removeEventListener('offline', goOffline) }
  }, [])

  // Sincronización en tiempo real entre dispositivos (solo con sesión)
  useEffect(() => {
    if (!session) return
    let t
    const trigger = () => { clearTimeout(t); t = setTimeout(refrescar, 400) }
    const ch = supabase
      .channel('cambios-bodega')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, trigger)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ventas' }, trigger)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gastos' }, trigger)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categorias' }, trigger)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'config' }, trigger)
      .subscribe()
    return () => { clearTimeout(t); supabase.removeChannel(ch) }
  }, [session])

  // ---- Acciones (guardan en Supabase) ----
  const setTasa = async (valor) => {
    setTasaState(valor)
    await db.guardarTasa(valor)
  }

  const registrarVenta = async (carrito, totalUSD, metodo, ref4) => {
    const venta = { fecha: todayISO(), hora: nowHora(), metodo, ref4, tasa, usd: totalUSD }
    // Optimista: descontar stock al instante
    setProductos((prev) =>
      prev.map((p) => {
        const c = carrito.find((x) => x.id === p.id)
        return c ? { ...p, stock: Math.max(0, p.stock - c.qty), vendidos: (p.vendidos || 0) + c.qty } : p
      }),
    )

    const guardarOffline = () => {
      encolar({ id: uid(), tipo: 'venta', payload: { venta, carrito } })
      setPendientes(leerCola().length)
      setActividad((prev) => [actividadLocalVenta(venta, carrito, prev), ...prev])
      setOnline(false)
      showToast('Venta guardada sin conexión · se subirá al volver el internet')
    }

    if (!navigator.onLine) return guardarOffline()
    try {
      const { error } = await db.crearVenta(venta, carrito, tasa)
      if (error) throw error
      showToast('Venta registrada · inventario actualizado')
      refrescar()
    } catch (e) {
      guardarOffline()
    }
  }

  const registrarGasto = async (gasto) => {
    const g = { ...gasto, fecha: todayISO(), hora: nowHora(), tasa }
    const guardarOffline = () => {
      encolar({ id: uid(), tipo: 'gasto', payload: { gasto: g } })
      setPendientes(leerCola().length)
      setActividad((prev) => [
        { id: 'local-' + uid(), tipo: 'gasto', fecha: g.fecha, hora: g.hora, cat: g.cat, desc: g.desc, tasa: g.tasa, usd: g.usd, pendiente: true },
        ...prev,
      ])
      setOnline(false)
      showToast('Gasto guardado sin conexión · se subirá al volver el internet')
    }

    if (!navigator.onLine) return guardarOffline()
    try {
      const res = await db.crearGasto(g)
      if (res && res.error) throw res.error
      showToast('Gasto guardado')
      refrescar()
    } catch (e) {
      guardarOffline()
    }
  }

  const agregarProducto = async (prod) => {
    showToast('Producto agregado al inventario')
    if (prod.cat && !categorias.includes(prod.cat)) await db.crearCategoria(prod.cat)
    await db.crearProducto(prod)
    refrescar()
  }

  const editarProducto = async (id, cambios) => {
    showToast('Producto actualizado')
    if (cambios.cat && !categorias.includes(cambios.cat)) await db.crearCategoria(cambios.cat)
    await db.actualizarProducto(id, cambios)
    refrescar()
  }

  // Reponer stock (llega mercancía): suma unidades
  const reponerStock = async (id, cantidad) => {
    const p = productos.find((x) => x.id === id)
    if (!p) return
    setProductos((prev) => prev.map((x) => (x.id === id ? { ...x, stock: x.stock + cantidad } : x)))
    showToast('Stock actualizado')
    await db.actualizarProducto(id, { stock: p.stock + cantidad })
    refrescar()
  }

  const agregarCategoria = async (nombre) => {
    const n = nombre.trim()
    if (n && !categorias.includes(n)) {
      setCategorias((prev) => [...prev, n])
      await db.crearCategoria(n)
    }
  }

  const stockBajo = useMemo(() => productos.filter((p) => p.stock <= p.minimo), [productos])

  // Candado de acceso
  if (session === undefined) {
    return (
      <div className="phone-wrap">
        <div className="phone">
          <div className="cargando"><div className="spinner" /></div>
        </div>
      </div>
    )
  }
  if (!session) return <Login />

  return (
    <div className="phone-wrap">
      <div className="phone">
        <NetBanner online={online} pendientes={pendientes} />
        {cargando ? (
          <div className="cargando">
            <div className="spinner" />
            <div>Cargando tu bodega…</div>
          </div>
        ) : (
          <>
            {tab === 'inicio' && (
              <Inicio
                tasa={tasa}
                setTasa={setTasa}
                productos={productos}
                actividad={actividad}
                stockBajo={stockBajo}
                tema={tema}
                alternarTema={alternarTema}
                onLogout={cerrarSesion}
                onVerTodo={() => setTab('historial')}
                onRefrescar={refrescar}
              />
            )}
            {tab === 'productos' && (
              <Productos
                tasa={tasa}
                productos={productos}
                categorias={categorias}
                onAdd={agregarProducto}
                onEditar={editarProducto}
                onReponer={reponerStock}
                onGasto={registrarGasto}
                onNuevaCategoria={agregarCategoria}
                onRefrescar={refrescar}
              />
            )}
            {tab === 'vender' && (
              <Vender tasa={tasa} productos={productos} categorias={categorias} onCobrar={registrarVenta} onRefrescar={refrescar} />
            )}
            {tab === 'gastos' && <Gastos tasa={tasa} actividad={actividad} onGuardar={registrarGasto} onRefrescar={refrescar} />}
            {tab === 'historial' && <Historial tasa={tasa} actividad={actividad} onToast={showToast} onRefrescar={refrescar} />}
          </>
        )}

        {toast && <div className="toast">{toast}</div>}

        <nav className="bottom-nav">
          <NavItem id="inicio" label="Inicio" tab={tab} setTab={setTab} Icon={Home} />
          <NavItem id="productos" label="Productos" tab={tab} setTab={setTab} Icon={Inventory} />
          <SellNav active={tab === 'vender'} onClick={() => setTab('vender')} />
          <NavItem id="gastos" label="Gastos" tab={tab} setTab={setTab} Icon={Payments} />
          <NavItem id="historial" label="Historial" tab={tab} setTab={setTab} Icon={History} />
        </nav>
      </div>
    </div>
  )
}

function NavItem({ id, label, tab, setTab, Icon }) {
  return (
    <button className={`nav-item ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
      <Icon size={24} />
      <span>{label}</span>
    </button>
  )
}

function SellNav({ active, onClick }) {
  return (
    <button className={`nav-item nav-sell ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="circle">
        <Sell size={26} />
      </span>
      <span className="lbl">Vender</span>
    </button>
  )
}

function nowHora() {
  const d = new Date()
  return d.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false })
}

// Actividad local de una venta hecha sin conexión (para mostrarla al instante)
function actividadLocalVenta(venta, carrito, actividad) {
  const numero = 1000 + actividad.filter((a) => a.tipo === 'venta').length + 1
  return {
    id: 'local-' + uid(),
    numero,
    tipo: 'venta',
    fecha: venta.fecha,
    hora: venta.hora,
    metodo: venta.metodo,
    ref4: venta.ref4 || undefined,
    tasa: venta.tasa,
    usd: venta.usd,
    items: carrito.map((c) => `${c.qty}x ${c.nombre}`),
    pendiente: true,
  }
}

// Aviso de estado de conexión / pendientes
function NetBanner({ online, pendientes }) {
  if (online && pendientes === 0) return null
  const texto = !online
    ? pendientes > 0
      ? `Sin conexión · ${pendientes} por sincronizar`
      : 'Sin conexión · trabajando offline'
    : `Sincronizando… ${pendientes} pendiente${pendientes !== 1 ? 's' : ''}`
  return <div className={`net-banner ${online ? 'sync' : 'off'}`}>{texto}</div>
}
