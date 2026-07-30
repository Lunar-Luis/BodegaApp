import { Store } from '../icons.jsx'

export default function Header({ title = 'Tú Bodega Online', right = null }) {
  return (
    <header className="app-header">
      <div className="brand">
        <Store size={24} />
      </div>
      <span className="brand" style={{ fontSize: 17 }}>{title}</span>
      {/* Slot derecho (ej: botón de tema). Espaciador si no hay nada, para centrar el título */}
      {right || <div style={{ width: 40 }} />}
    </header>
  )
}
