import { useState } from 'react'
import { supabase } from '../supabase.js'
import { Store, Eye, EyeOff } from '../icons.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [verPass, setVerPass] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [logoOk, setLogoOk] = useState(true)

  const entrar = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass })
    if (error) setError('Correo o contraseña incorrectos')
    setCargando(false)
  }

  return (
    <div className="phone-wrap">
      <div className="phone">
        <form className="login" onSubmit={entrar}>
          <div className="login-logo">
            {logoOk ? (
              <img src="/logo.png" alt="Tú Bodega Online" onError={() => setLogoOk(false)} />
            ) : (
              <div className="login-logo-fallback"><Store size={44} /></div>
            )}
          </div>
          <h1>Tú Bodega Online</h1>
          <p className="muted" style={{ textAlign: 'center', marginBottom: 8 }}>Entra con la cuenta de la bodega</p>

          <input
            className="input"
            type="email"
            placeholder="Correo"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div style={{ position: 'relative' }}>
            <input
              className="input"
              type={verPass ? 'text' : 'password'}
              placeholder="Contraseña"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              style={{ paddingRight: 48 }}
            />
            <button
              type="button"
              className="icon-btn"
              onClick={() => setVerPass((v) => !v)}
              aria-label={verPass ? 'Ocultar contraseña' : 'Ver contraseña'}
              style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)' }}
            >
              {verPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="btn" type="submit" disabled={cargando} style={{ marginTop: 6 }}>
            {cargando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
