import jsPDF from 'jspdf'
import QRCode from 'qrcode'

export function generateReservationPDF(
  reservation: any,
  t: (key: string, options?: any) => string,
  formatPrice: (price: number) => string,
  lang: string
) {
  const locale = lang === 'en' ? 'en-US' : 'es-MX'
  const currency = 'MXN'

  const status = reservation.atendido ? t('search.confirmed') : t('search.pending')

  let roomsHtml = ''
  if (reservation.habitaciones && Array.isArray(reservation.habitaciones)) {
    roomsHtml = reservation.habitaciones.map((h: any) =>
      `<p><strong>Habitacion:</strong> ${h.tipo} x${h.cantidad} — ${currency} $${formatPrice(h.subtotal || 0)}</p>`
    ).join('')
  } else {
    roomsHtml = `<p><strong>${t('search.labels.room')}:</strong> ${reservation.habitacion_tipo || ''} (${reservation.habitacion_cantidad || ''})</p>`
  }

  const dateStr = reservation.fecha_creacion
    ? new Date(reservation.fecha_creacion).toLocaleString(locale, { dateStyle: 'long', timeStyle: 'short' })
    : ''

  void QRCode.toDataURL(reservation.numero_de_pedido, { width: 200, margin: 1 }).then((qrDataUrl: string) => {
    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>Reserva ${reservation.numero_de_pedido}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e1e1e; padding: 0; }
    .header { background: #2d7a9e; color: #fff; text-align: center; padding: 24px 20px 18px; }
    .header .stars { font-size: 18px; letter-spacing: 4px; margin-bottom: 4px; }
    .header h1 { font-size: 20px; margin: 2px 0; font-weight: 700; }
    .header .sub { font-size: 10px; opacity: 0.85; }
    .qr-section { text-align: center; padding: 16px 20px 8px; }
    .qr-section img { width: 90px; height: 90px; }
    .order-badge { text-align: center; padding: 0 20px 8px; }
    .order-badge .num { font-size: 14px; font-weight: 700; color: #2d7a9e; }
    .order-badge .status { font-size: 10px; color: ${reservation.atendido ? '#2e7d32' : '#c83232'}; margin-top: 2px; }
    table { width: calc(100% - 40px); border-collapse: collapse; margin: 0 20px; }
    tr { border-bottom: 1px solid #e2e8f0; }
    td { padding: 10px 12px; font-size: 11px; line-height: 1.5; }
    td.label { font-weight: 700; color: #2d7a9e; width: 110px; white-space: nowrap; vertical-align: top; }
    table p { margin: 2px 0; font-size: 11px; }
    .footer { text-align: center; color: #888; font-size: 9px; padding: 20px; margin-top: 12px; border-top: 1px solid #e2e8f0; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="stars">★★★★★</div>
    <h1>THE GRAND EXECUTIVE</h1>
    <div class="sub">${t('hotel.category')} · ${t('hotel.plan')}</div>
  </div>
  <div class="qr-section">
    <img src="${qrDataUrl}" alt="QR ${reservation.numero_de_pedido}" />
  </div>
  <div class="order-badge">
    <div class="num">${t('search.labels.orderNumber')}: ${reservation.numero_de_pedido}</div>
    <div class="status">${status}</div>
  </div>
  <table>
    <tr><td class="label">${t('search.labels.holder')}</td><td>${reservation.nombre || ''}</td></tr>
    <tr><td class="label">${t('search.labels.email')}</td><td>${reservation.email || ''}</td></tr>
    <tr><td class="label">${t('search.labels.phone')}</td><td>${reservation.telefono || ''}</td></tr>
    <tr><td class="label">${t('search.labels.dates')}</td><td>${reservation.checkIn} — ${reservation.checkOut}</td></tr>
    <tr><td class="label">Rooms</td><td>${roomsHtml}</td></tr>
    <tr><td class="label">${t('search.labels.accessibility')}</td><td>${reservation.acomodaciones || t('search.labels.none')}</td></tr>
    <tr><td class="label">${t('search.labels.total')}</td><td style="font-weight:700;font-size:13px;">${currency} $${formatPrice(reservation.precio_total_numero || reservation.precio_total || 0)}</td></tr>
    ${dateStr ? `<tr><td class="label">${t('search.labels.reservationDate')}</td><td>${dateStr}</td></tr>` : ''}
  </table>
  <div class="footer">
    <strong>The Grand Executive</strong><br>
    Paseo de la Reforma 222, Col. Juárez, CDMX, México<br>
    +52 55 9171 0000 · reservas@thegrandexecutive.mx
  </div>
  <script>window.onload = () => window.print()</script>
</body>
</html>`

    const printWindow = window.open('', '_blank', 'width=800,height=700')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
    }
  })
}

export async function generateReservationPDFBlob(
  reservation: any,
  t: (key: string, options?: any) => string,
  formatPrice: (price: number) => string,
  lang: string
): Promise<Blob> {
  const currency = 'MXN'
  const doc = new jsPDF()
  const pageW = 210
  let y = 0

  doc.setFillColor(45, 122, 158)
  doc.rect(0, y, pageW, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.text('★★★★★', pageW / 2, y + 10, { align: 'center' })
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('THE GRAND EXECUTIVE', pageW / 2, y + 19, { align: 'center' })
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  y += 28

  const qrDataUrl = await QRCode.toDataURL(reservation.numero_de_pedido, { width: 140, margin: 1 })
  doc.addImage(qrDataUrl, 'PNG', pageW / 2 - 14, y + 2, 28, 28)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(45, 122, 158)
  doc.text(`${t('search.labels.orderNumber')}: ${reservation.numero_de_pedido}`, pageW / 2, y + 34, { align: 'center' })
  y += 40

  const status = reservation.atendido ? t('search.confirmed') : t('search.pending')
  doc.setFontSize(8)
  doc.setTextColor(reservation.atendido ? 46 : 200, reservation.atendido ? 125 : 50, reservation.atendido ? 50 : 50)
  doc.text(status, pageW / 2, y, { align: 'center' })
  y += 8

  const rows: [string, string][] = [
    [t('search.labels.holder'), reservation.nombre || ''],
    [t('search.labels.email'), reservation.email || ''],
    [t('search.labels.phone'), reservation.telefono || ''],
    [t('search.labels.dates'), `${reservation.checkIn}  —  ${reservation.checkOut}`],
  ]

  if (reservation.habitaciones && Array.isArray(reservation.habitaciones)) {
    const roomsText = reservation.habitaciones
      .map((h: any) => `${h.tipo}  x${h.cantidad}  (${currency} $${formatPrice(h.subtotal || 0)})`)
      .join('\n')
    rows.push([t('search.labels.room') + 's', roomsText])
  } else {
    rows.push([t('search.labels.room'), `${reservation.habitacion_tipo || ''} (${reservation.habitacion_cantidad || ''})`])
  }

  rows.push([t('search.labels.accessibility'), reservation.acomodaciones || t('search.labels.none')])
  rows.push([t('search.labels.total'), `${currency} $${formatPrice(reservation.precio_total_numero || reservation.precio_total || 0)}`])

  const dateStr = reservation.fecha_creacion
    ? new Date(reservation.fecha_creacion).toLocaleString(lang === 'en' ? 'en-US' : 'es-MX', { dateStyle: 'long', timeStyle: 'short' })
    : ''
  if (dateStr) rows.push([t('search.labels.reservationDate'), dateStr])

  doc.setFontSize(9)
  const leftX = 20
  const rightX = 190
  const lineH = 8

  for (const [label, value] of rows) {
    doc.setTextColor(45, 122, 158)
    doc.setFont('helvetica', 'bold')
    doc.text(label, leftX, y)
    doc.setTextColor(30, 30, 30)
    doc.setFont('helvetica', 'normal')
    const valueLines = doc.splitTextToSize(value, rightX - leftX - 55)
    doc.text(valueLines, leftX + 50, y)
    y += Math.max(lineH, valueLines.length * lineH)
  }

  y += 6
  doc.setFontSize(7)
  doc.setTextColor(120, 120, 120)
  doc.setFont('helvetica', 'normal')
  doc.text('The Grand Executive · Paseo de la Reforma 222, Col. Juárez, CDMX, México', pageW / 2, y, { align: 'center' })
  doc.text('+52 55 9171 0000 · reservas@thegrandexecutive.mx', pageW / 2, y + 5, { align: 'center' })

  return doc.output('blob')
}
