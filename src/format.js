// Formateo de moneda estilo Venezuela: Bs 1.186,25  /  $32.50

export const fmtUSD = (n) =>
  '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const fmtBs = (n) =>
  'Bs ' + Number(n || 0).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Valor del producto expresado en cada moneda, según la tasa del día
export const enUSD = (prod, tasa) => (prod.moneda === 'USD' ? prod.precio : prod.precio / tasa)
export const enBs = (prod, tasa) => (prod.moneda === 'USD' ? prod.precio * tasa : prod.precio)
