import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import type { TFunction } from 'i18next'
import './Checkout.css'

interface CheckoutData {
  nombre: string
  email: string
  telefono: string
  habitacion_tipo: string
  habitacion_cantidad: number
  checkIn: string
  checkOut: string
  precio_total_numero: number
  precio_total_formateado: string
  currency: string
  habitaciones: any[]
  acomodaciones: string
  mensaje: string
}

interface CheckoutProps {
  data: CheckoutData
  onPay: () => void
  onCancel: () => void
  t: TFunction
}

export function Checkout({ data, onPay, onCancel, t }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState('tarjeta')
  const [isProcessing, setIsProcessing] = useState(false)
  const [expiry, setExpiry] = useState('')

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 4) value = value.slice(0, 4)
    if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2)
    setExpiry(value)
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simular tiempo de procesamiento
    setTimeout(() => {
      setIsProcessing(false)
      onPay()
    }, 2000)
  }

  return (
    <div className="checkout-container animate-fade-in">
      <Toaster position="top-center" />
      <div className="checkout-header">
        <h1>{t('checkout.title', 'Pasarela de Pago Segura')}</h1>
        <button onClick={onCancel} className="btn-cancel-checkout">
          {t('checkout.cancel', 'Volver')}
        </button>
      </div>

      <div className="checkout-content">
        <div className="checkout-summary">
          <h2>{t('checkout.summaryTitle', 'Resumen de tu Reserva')}</h2>
          <div className="summary-details">
            <div className="summary-row">
              <span className="summary-label">{t('checkout.name', 'Titular:')}</span>
              <span className="summary-value">{data.nombre}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">{t('checkout.email', 'Correo:')}</span>
              <span className="summary-value">{data.email}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">{t('checkout.phone', 'Teléfono:')}</span>
              <span className="summary-value">{data.telefono}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">{t('checkout.dates', 'Fechas:')}</span>
              <span className="summary-value">{data.checkIn} a {data.checkOut}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">{t('checkout.rooms', 'Habitaciones:')}</span>
              <span className="summary-value">{data.habitacion_cantidad} x Habitaciones seleccionadas</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-row total-row">
              <span className="summary-label">{t('checkout.total', 'Total a Pagar:')}</span>
              <span className="summary-total">{data.precio_total_formateado}</span>
            </div>
          </div>
        </div>

        <div className="checkout-payment">
          <h2>{t('checkout.paymentMethod', 'Método de Pago')}</h2>
          
          <div className="payment-methods">
            <label className={`payment-method ${paymentMethod === 'tarjeta' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="method" 
                value="tarjeta" 
                checked={paymentMethod === 'tarjeta'}
                onChange={() => setPaymentMethod('tarjeta')}
              />
              <span className="method-name">💳 {t('checkout.creditCard', 'Tarjeta de Crédito/Débito')}</span>
            </label>
            <label className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="method" 
                value="paypal" 
                checked={paymentMethod === 'paypal'}
                onChange={() => setPaymentMethod('paypal')}
              />
              <span className="method-name">🌐 PayPal</span>
            </label>
          </div>

          <form onSubmit={handlePayment} className="payment-form">
            {paymentMethod === 'tarjeta' && (
              <div className="card-details">
                <div className="form-group card-input-group">
                  <label>{t('checkout.cardNumber', 'Número de Tarjeta')}</label>
                  <div className="input-with-icon">
                    <span className="input-icon">💳</span>
                    <input type="text" placeholder="0000 0000 0000 0000" className="form-input checkout-input" required maxLength={19} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group card-input-group">
                    <label>{t('checkout.cardExp', 'Vencimiento (MM/AA)')}</label>
                    <div className="input-with-icon">
                      <span className="input-icon">📅</span>
                      <input type="text" inputMode="numeric" placeholder="MM/AA" className="form-input checkout-input" required maxLength={5} value={expiry} onChange={handleExpiryChange} />
                    </div>
                  </div>
                  <div className="form-group card-input-group">
                    <label>{t('checkout.cardCvc', 'Código de Seguridad (CVC)')}</label>
                    <div className="input-with-icon">
                      <span className="input-icon">🔒</span>
                      <input type="text" placeholder="123" className="form-input checkout-input" required maxLength={4} />
                    </div>
                  </div>
                </div>
                <div className="form-group card-input-group">
                  <label>{t('checkout.cardName', 'Nombre en la Tarjeta')}</label>
                  <div className="input-with-icon">
                    <span className="input-icon">👤</span>
                    <input type="text" placeholder={data.nombre} defaultValue={data.nombre} className="form-input checkout-input" required />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="paypal-details">
                <p>{t('checkout.paypalDesc', 'Serás redirigido a PayPal para completar tu pago de forma segura.')}</p>
              </div>
            )}

            <button type="submit" className="btn-pay" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <svg className="spinner" viewBox="0 0 50 50" width="20" height="20">
                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                  </svg>
                  {t('checkout.processing', 'Procesando...')}
                </>
              ) : (
                `${t('checkout.payButton', 'Pagar')} ${data.precio_total_formateado}`
              )}
            </button>
            <div className="secure-badge">
              🔒 {t('checkout.secure', 'Pago 100% Seguro')}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
