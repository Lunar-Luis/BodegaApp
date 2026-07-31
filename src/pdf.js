import { fmtUSD, fmtBs } from './format.js'
import { metodoLabel } from './mock.js'

// Genera y descarga un PDF del reporte (día o mes), con los colores de la app.
export async function generarReportePDF({ titulo, t, registros, tasa }) {
  const { jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const M = 40
  const VIOLET = [122, 40, 245]

  // Cabecera
  doc.setFillColor(...VIOLET)
  doc.rect(0, 0, W, 92, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold'); doc.setFontSize(20)
  doc.text('Tú Bodega Online', M, 44)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(12)
  doc.text('Reporte · ' + titulo, M, 66)

  // Tarjetas de resumen
  const y = 120
  const boxW = (W - M * 2 - 20) / 3
  const boxes = [
    ['VENTAS', fmtUSD(t.ventasUsd), fmtBs(t.ventasBs), [16, 150, 95]],
    ['GASTOS', fmtUSD(t.gastosUsd), fmtBs(t.gastosBs), [180, 115, 15]],
    ['BALANCE', fmtUSD(t.balanceUsd), fmtBs(t.balanceBs), t.balanceUsd >= 0 ? VIOLET : [200, 45, 45]],
  ]
  boxes.forEach((b, i) => {
    const x = M + i * (boxW + 10)
    doc.setDrawColor(230, 224, 246); doc.setFillColor(248, 245, 253)
    doc.roundedRect(x, y, boxW, 66, 8, 8, 'FD')
    doc.setTextColor(120, 110, 140); doc.setFont('helvetica', 'bold'); doc.setFontSize(9)
    doc.text(b[0], x + 12, y + 20)
    doc.setTextColor(...b[3]); doc.setFontSize(15)
    doc.text(String(b[1]), x + 12, y + 41)
    doc.setTextColor(140, 140, 155); doc.setFont('helvetica', 'normal'); doc.setFontSize(9)
    doc.text(String(b[2]), x + 12, y + 57)
  })

  // Tabla de actividad
  const rows = (registros || []).map((a) => [
    a.hora || '',
    a.tipo === 'venta' ? `Venta #${a.numero || ''}` : (a.desc || ''),
    a.tipo === 'venta' ? metodoLabel(a.metodo) + (a.ref4 ? ` ••${a.ref4}` : '') : (a.cat || ''),
    (a.tipo === 'venta' ? '+' : '-') + fmtUSD(a.usd),
    fmtBs(a.usd * (a.tasa || tasa)),
  ])

  autoTable(doc, {
    startY: y + 92,
    head: [['Hora', 'Detalle', 'Forma / Categoría', 'USD', 'Bs']],
    body: rows.length ? rows : [['', 'Sin movimientos', '', '', '']],
    theme: 'grid',
    headStyles: { fillColor: VIOLET, textColor: 255, fontStyle: 'bold', fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 5, textColor: [40, 35, 55] },
    alternateRowStyles: { fillColor: [248, 245, 253] },
    columnStyles: { 3: { halign: 'right' }, 4: { halign: 'right' } },
    margin: { left: M, right: M },
  })

  // Pie
  doc.setTextColor(150, 150, 160); doc.setFontSize(9)
  doc.text('Generado el ' + new Date().toLocaleString('es-VE'), M, H - 24)

  doc.save(`reporte-${String(titulo).replace(/\s+/g, '-').toLowerCase()}.pdf`)
}
