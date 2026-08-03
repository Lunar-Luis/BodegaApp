// Almacenamiento local para trabajar sin internet:
//  - "cache": copia de los datos (inventario, actividad, categorías, tasa) para verlos offline.
//  - "cola": ventas/gastos hechos sin conexión, pendientes de subir a la nube.

const CACHE_KEY = 'bodega:cache'
const COLA_KEY = 'bodega:cola'

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

export function guardarCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)) } catch {}
}
export function leerCache() {
  try { const s = localStorage.getItem(CACHE_KEY); return s ? JSON.parse(s) : null } catch { return null }
}

export function leerCola() {
  try { const s = localStorage.getItem(COLA_KEY); return s ? JSON.parse(s) : [] } catch { return [] }
}
export function guardarCola(cola) {
  try { localStorage.setItem(COLA_KEY, JSON.stringify(cola)) } catch {}
}
export function encolar(op) {
  const cola = leerCola()
  cola.push(op)
  guardarCola(cola)
  return cola
}
