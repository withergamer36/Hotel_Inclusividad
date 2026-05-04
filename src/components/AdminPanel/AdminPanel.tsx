import { useState } from 'react'
import { db } from '../../lib/firebase'
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore'
import * as XLSX from 'xlsx';
import './AdminPanel.css'

export function AdminPanel() {
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
      alert('Usuario o contraseña incorrectos')
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
    } catch (error) {
      alert('Error al actualizar')
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
      'Fecha': new Date(r.fecha_creacion).toLocaleString('es-MX'),
      'Estado': r.atendido ? 'Atendido' : 'Pendiente'
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas')
    
    // Ajustar ancho de columnas
    const wscols = [
      {wch: 15}, {wch: 25}, {wch: 30}, {wch: 15}, {wch: 25}, 
      {wch: 10}, {wch: 40}, {wch: 25}, {wch: 15}
    ]
    worksheet['!cols'] = wscols

    XLSX.writeFile(workbook, `Reporte_Reservas_Hotel_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="login-card">
          <div className="login-header">
            <span className="logo-icon">&#x1F3E8;</span>
            <h2>Dashboard Administrativo</h2>
            <p>Acceso restringido para personal del hotel</p>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="admin-user">Usuario</label>
              <input
                id="admin-user"
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="admin-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="admin-pass">Contraseña</label>
              <input
                id="admin-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary login-btn">
              Entrar al Sistema
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
          <h1>Panel de Control</h1>
          <p>Gestión de reservas y solicitudes de accesibilidad</p>
        </div>
        <div className="header-actions">
          <button onClick={exportToExcel} className="btn btn-excel">
            📊 Exportar a Excel
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Reservas</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-label">Pendientes</span>
          <span className="stat-value">{stats.pendientes}</span>
        </div>
        <div className="stat-card success">
          <span className="stat-label">Atendidas</span>
          <span className="stat-value">{stats.atendidas}</span>
        </div>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div className="loading-state">Cargando reservas...</div>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th>Estado</th>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Reserva</th>
                <th>Accesibilidad</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id} className={reserva.atendido ? 'is-atendido' : ''}>
                  <td data-label="Estado">
                    <span className={`badge ${reserva.atendido ? 'bg-success' : 'bg-warning'}`}>
                      {reserva.atendido ? 'Atendido' : 'Pendiente'}
                    </span>
                  </td>
                  <td data-label="Pedido" className="font-mono">{reserva.numero_de_pedido}</td>
                  <td data-label="Cliente">
                    <div className="td-client">
                      <span className="name">{reserva.nombre}</span>
                      <span className="contact">{reserva.email}</span>
                      <span className="contact">{reserva.telefono}</span>
                    </div>
                  </td>
                  <td data-label="Reserva">
                    <div className="td-reserva">
                      <span className="room">{reserva.habitacion_tipo}</span>
                      <span className="qty">Cantidad: {reserva.habitacion_cantidad}</span>
                      <span className="dates text-xs text-gray-500">{reserva.checkIn} al {reserva.checkOut}</span>
                    </div>
                  </td>
                  <td data-label="Accesibilidad">
                    <div className="td-acc" title={reserva.acomodaciones}>
                      {reserva.acomodaciones || 'Ninguna'}
                    </div>
                  </td>
                  <td data-label="Fecha" className="date">{new Date(reserva.fecha_creacion).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td data-label="Acciones">
                    <button 
                      onClick={() => handleToggleAtendido(reserva.id, reserva.atendido)}
                      className={`action-btn ${reserva.atendido ? 'btn-undo' : 'btn-complete'}`}
                    >
                      {reserva.atendido ? '↩️' : '✅'}
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
