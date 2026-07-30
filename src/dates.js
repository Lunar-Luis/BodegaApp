// Utilidades de fecha para el historial (formato local es-VE)

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const DIAS_SEM = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']

export const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 'YYYY-MM-DD' -> partes numéricas seguras (sin desfase de zona horaria)
const parts = (iso) => iso.split('-').map(Number) // [y, m, d]

export const monthKey = (iso) => iso.slice(0, 7) // 'YYYY-MM'

export const mesLabel = (key) => {
  const [y, m] = key.split('-').map(Number)
  return `${MESES[m - 1][0].toUpperCase()}${MESES[m - 1].slice(1)} ${y}`
}

export const diaSemana = (iso) => {
  const [y, m, d] = parts(iso)
  return DIAS_SEM[new Date(y, m - 1, d).getDay()]
}

export const diaNum = (iso) => parts(iso)[2]

export const fechaLarga = (iso) => {
  const [y, m, d] = parts(iso)
  return `${DIAS_SEM[new Date(y, m - 1, d).getDay()]} ${d} de ${MESES[m - 1]}`
}

// Suma/resta días a una fecha 'YYYY-MM-DD'
export const shiftDay = (iso, delta) => {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d + delta)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

// Suma/resta meses a una key 'YYYY-MM'
export const shiftMonth = (key, delta) => {
  let [y, m] = key.split('-').map(Number)
  m += delta
  while (m < 1) { m += 12; y-- }
  while (m > 12) { m -= 12; y++ }
  return `${y}-${String(m).padStart(2, '0')}`
}
