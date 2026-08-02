import { useState } from 'react'
import { Store } from '../icons.jsx'

// El ícono de la tienda es también el botón de "actualizar" (camuflado).
export default function Header({ title = 'Tú Bodega Online', right = null, onRefresh }) {
  const [spin, setSpin] = useState(false)

  const refrescar = async () => {
    if (!onRefresh || spin) return
    setSpin(true)
    try { await onRefresh() } finally { setTimeout(() => setSpin(false), 500) }
  }

  return (
    <header className="app-header">
      <button className="icon-btn brand" onClick={refrescar} aria-label="Actualizar" disabled={!onRefresh}>
        <span className={spin ? 'spin' : ''} style={{ display: 'inline-flex' }}><Store size={24} /></span>
      </button>
      <span className="brand" style={{ fontSize: 17 }}>{title}</span>
      {/* Slot derecho (ej: botón de tema). Espaciador si no hay nada, para centrar el título */}
      {right || <div style={{ width: 40 }} />}
    </header>
  )
}
