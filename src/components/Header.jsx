import { useState } from 'react'
import { Store, Refresh } from '../icons.jsx'

export default function Header({ title = 'Tú Bodega Online', right = null, onRefresh }) {
  const [spin, setSpin] = useState(false)

  const refrescar = async () => {
    if (!onRefresh || spin) return
    setSpin(true)
    try { await onRefresh() } finally { setTimeout(() => setSpin(false), 500) }
  }

  return (
    <header className="app-header">
      {onRefresh ? (
        <button className="icon-btn" onClick={refrescar} aria-label="Actualizar">
          <span className={spin ? 'spin' : ''} style={{ display: 'inline-flex' }}><Refresh size={22} /></span>
        </button>
      ) : (
        <div className="brand"><Store size={24} /></div>
      )}
      <span className="brand" style={{ fontSize: 17 }}>{title}</span>
      {/* Slot derecho (ej: botón de tema). Espaciador si no hay nada, para centrar el título */}
      {right || <div style={{ width: 40 }} />}
    </header>
  )
}
