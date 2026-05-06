import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { db } from '../../lib/firebase'
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore'
import * as XLSX from 'xlsx';
import './AdminPanel.css'

export function AdminPanel() {
  const { t, i18n } = useTranslation()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [reservas, setReservas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const ADMIN_USER = 'admin'
  const ADMIN_PASSWORD = 'admin_hotel_2024'

  const stats = {
    total: reservas.length,
    pendientes: reservas.filter(r => !r.atendido).length,
    atendidas: reservas.filter(r => r.atendido).length
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (user === ADMIN_USER && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      fetchReservas()
    } else {
      alert(t('admin.loginError'))
    }
  }

  const fetchReservas = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, 'reservas'), orderBy('fecha_creacion', 'desc'))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setReservas(data)
    } catch (error) {
      console.error('Error al cargar reservas:', error)
    }
    setLoading(false)
  }

  const handleToggleAtendido = async (id: string, estadoActual: boolean) => {
    try {
      const reservaRef = doc(db, 'reservas', id)
      await updateDoc(reservaRef, { atendido: !estadoActual })
      fetchReservas()
    } catch {
      alert(t('admin.updateError'))
    }
  }

  const exportToExcel = () => {
    const dataToExport = reservas.map(r => ({
      'No. Pedido': r.numero_de_pedido,
      'Cliente': r.nombre,
      'Email': r.email,
      'Teléfono': r.telefono,
      'Habitación': r.habitacion_tipo,
      'Cantidad': r.habitacion_cantidad,
      'Accesibilidad': r.acomodaciones,
      'Fecha': new Date(r.fecha_creacion).toLocaleString(i18n.language === 'en' ? 'en-US' : 'es-MX'),
      'Estado': r.atendido ? t('admin.attendedLabel') : t('admin.pendingLabel')
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas')

    const wscols = [
      {wch: 15}, {wch: 25}, {wch: 30}, {wch: 15}, {wch: 25},
      {wch: 10}, {wch: 40}, {wch: 25}, {wch: 15}
    ]
    worksheet['!cols'] = wscols

    const fileName = t('admin.exportFileName', { date: new Date().toISOString().split('T')[0] })
    XLSX.writeFile(workbook, fileName)
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="login-card">
          <div className="login-header">
            <span className="logo-icon">{'\u{1F3E8}'}</span>
            <h2>{t('admin.loginTitle')}</h2>
            <p>{t('admin.loginSubtitle')}</p>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="admin-user">{t('admin.user')}</label>
              <input
                id="admin-user"
                type="text"
                placeholder={t('admin.userPlaceholder')}
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="admin-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="admin-pass">{t('admin.password')}</label>
              <input
                id="admin-pass"
                type="password"
                placeholder={t('admin.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary login-btn">
              {t('admin.loginButton')}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header-main">
        <div className="header-info">
          <h1>{t('admin.dashboard')}</h1>
          <p>{t('admin.dashboardSubtitle')}</p>
        </div>
        <div className="header-actions">
          <button onClick={exportToExcel} className="btn btn-excel">
            {'\u{1F4CA}'} {t('admin.exportExcel')}
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="btn-logout">
            {t('admin.logout')}
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">{t('admin.totalReservations')}</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-label">{t('admin.pending')}</span>
          <span className="stat-value">{stats.pendientes}</span>
        </div>
        <div className="stat-card success">
          <span className="stat-label">{t('admin.attended')}</span>
          <span className="stat-value">{stats.atendidas}</span>
        </div>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div className="loading-state">{t('admin.loading')}</div>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th>{t('admin.tableHeaders.status')}</th>
                <th>{t('admin.tableHeaders.order')}</th>
                <th>{t('admin.tableHeaders.client')}</th>
                <th>{t('admin.tableHeaders.reservation')}</th>
                <th>{t('admin.tableHeaders.accessibility')}</th>
                <th>{t('admin.tableHeaders.date')}</th>
                <th>{t('admin.tableHeaders.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id} className={reserva.atendido ? 'is-atendido' : ''}>
                  <td data-label={t('admin.tableHeaders.status')}>
                    <span className={`badge ${reserva.atendido ? 'bg-success' : 'bg-warning'}`}>
                      {reserva.atendido ? t('admin.attendedLabel') : t('admin.pendingLabel')}
                    </span>
                  </td>
                  <td data-label={t('admin.tableHeaders.order')} className="font-mono">{reserva.numero_de_pedido}</td>
                  <td data-label={t('admin.tableHeaders.client')}>
                    <div className="td-client">
                      <span className="name">{reserva.nombre}</span>
                      <span className="contact">{reserva.email}</span>
                      <span className="contact">{reserva.telefono}</span>
                    </div>
                  </td>
                  <td data-label={t('admin.tableHeaders.reservation')}>
                    <div className="td-reserva">
                      <span className="room">{reserva.habitacion_tipo}</span>
                      <span className="qty">{t('admin.quantity', { qty: reserva.habitacion_cantidad })}</span>
                      <span className="dates text-xs text-gray-500">{reserva.checkIn} al {reserva.checkOut}</span>
                    </div>
                  </td>
                  <td data-label={t('admin.tableHeaders.accessibility')}>
                    <div className="td-acc" title={reserva.acomodaciones}>
                      {reserva.acomodaciones || t('admin.none')}
                    </div>
                  </td>
                  <td data-label={t('admin.tableHeaders.date')} className="date">{new Date(reserva.fecha_creacion).toLocaleString(i18n.language === 'en' ? 'en-US' : 'es-MX', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td data-label={t('admin.tableHeaders.actions')}>
                    <button
                      onClick={() => handleToggleAtendido(reserva.id, reserva.atendido)}
                      className={`action-btn ${reserva.atendido ? 'btn-undo' : 'btn-complete'}`}
                    >
                      {reserva.atendido ? '\u21A9\uFE0F' : '\u2705'}
                    </button>
                  </td>
                </tr>

              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
