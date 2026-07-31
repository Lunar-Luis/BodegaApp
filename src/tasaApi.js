// Trae la tasa del dólar de Venezuela (Bs por $) desde DolarAPI.
// fuente: 'oficial' (BCV) | 'paralelo'
export async function traerTasa(fuente = 'oficial') {
  const res = await fetch(`https://ve.dolarapi.com/v1/dolares/${fuente}`)
  if (!res.ok) throw new Error('No se pudo obtener la tasa')
  const data = await res.json()
  const valor = Number(data.promedio)
  if (!valor || isNaN(valor)) throw new Error('Respuesta inválida')
  return valor
}
