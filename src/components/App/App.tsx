import { useState, useEffect, useRef, useCallback } from 'react'
import { AccessibilityToolbar, type AccessibilityState } from '../AccessibilityToolbar/AccessibilityToolbar'
import { RoomFilters } from '../RoomFilters/RoomFilters'
import { AccessibilityMap } from '../AccessibilityMap/AccessibilityMap'
import { hotelData, accommodationOptions, type Room } from '../../data/hotelData'
import { db } from '../../lib/firebase'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import emailjs from '@emailjs/browser'
import { AdminPanel } from '../AdminPanel/AdminPanel'
import './App.css'

function StarIcon(props: React.SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={props.filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function formatPrice(price: number): string {
  return price.toLocaleString('es-MX')
}

interface SectionSpeakerProps {
  text: string
  rate: number
  ariaLabel: string
}

function SectionSpeaker({ text, rate, ariaLabel }: SectionSpeakerProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = rate
    utterance.pitch = 1

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  return (
    <button
      className="section-speaker"
      onClick={handleSpeak}
      aria-label={ariaLabel}
      aria-pressed={isSpeaking}
    >
      {isSpeaking ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="6" y="6" width="12" height="12" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  )
}

function PageSpeaker({ rate }: { rate: number }) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const isActiveRef = useRef(false)

  const splitIntoChunks = (text: string, maxChars: number): string[] => {
    if (text.length <= maxChars) return [text]
    const chunks: string[] = []
    const sentences = text.split(/(?<=[.!?])\s+/)
    let current = ''
    for (const sentence of sentences) {
      if ((current + sentence).length > maxChars && current.length > 0) {
        chunks.push(current.trim())
        current = sentence
      } else {
        current += (current ? ' ' : '') + sentence
      }
    }
    if (current.trim()) chunks.push(current.trim())
    return chunks
  }

  const handleSpeak = () => {
    if (isSpeaking) {
      isActiveRef.current = false
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return
    }

    const mainContent = document.getElementById('main-content')
    if (!mainContent) return

    const clone = mainContent.cloneNode(true) as HTMLElement
    const icons = clone.querySelectorAll('[aria-hidden="true"], .sr-only, .section-speaker, .hero-buttons a, .facility-card, .room-card, .testimonial-card, .facility-detail-panel, .map-detail-card, .map-empty-state, .map-sidebar, .accessibility-toolbar, .nav, .footer-links')
    icons.forEach(el => el.remove())

    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT, null)
    const textParts: string[] = []
    let node: Node | null = walker.nextNode()
    while (node) {
      const t = node.textContent?.trim()
      if (t) textParts.push(t)
      node = walker.nextNode()
    }
    const fullText = textParts.join('. ')
    if (!fullText.trim()) return

    isActiveRef.current = true
    const chunks = splitIntoChunks(fullText, 200)

    const speakNext = (index: number) => {
      if (!isActiveRef.current || index >= chunks.length) {
        isActiveRef.current = false
        setIsSpeaking(false)
        return
      }
      const utterance = new SpeechSynthesisUtterance(chunks[index])
      utterance.lang = 'es-ES'
      utterance.rate = rate
      utterance.pitch = 1
      utterance.onend = () => speakNext(index + 1)
      utterance.onerror = () => {
        isActiveRef.current = false
        setIsSpeaking(false)
      }
      window.speechSynthesis.speak(utterance)
    }

    setIsSpeaking(true)
    speakNext(0)
  }

  return (
    <button
      className="hero-speaker"
      onClick={handleSpeak}
      aria-label={isSpeaking ? 'Detener lectura de la página' : 'Leer toda la página'}
      aria-pressed={isSpeaking}
    >
      {isSpeaking ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="6" y="6" width="12" height="12" />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  )
}

function App() {
  const [accessibility, setAccessibility] = useState<AccessibilityState>({
    fontSize: 1,
    dyslexiaFont: false,
    highContrast: false,
    darkMode: false,
    reduceMotion: false,
    increasedSpacing: false,
    readingLine: false,
    isSpeaking: false,
    speechRate: 1
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [announcement, setAnnouncement] = useState('')
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>([])
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null)
  const [isAdminView, setIsAdminView] = useState(false)
  const [searchOrder, setSearchOrder] = useState('')
  const [foundReservation, setFoundReservation] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const readingLineRef = useRef<HTMLDivElement>(null)
  const announcerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const announce = useCallback((message: string) => {
    setAnnouncement(message)
    if (announcerTimeoutRef.current) {
      clearTimeout(announcerTimeoutRef.current)
    }
    announcerTimeoutRef.current = setTimeout(() => {
      setAnnouncement('')
    }, 3000)
  }, [])

  useEffect(() => {
    return () => {
      if (announcerTimeoutRef.current) {
        clearTimeout(announcerTimeoutRef.current)
      }
      window.speechSynthesis.cancel()
    }
  }, [])

  useEffect(() => {
    if (accessibility.readingLine) {
      const handleMouseMove = (e: MouseEvent) => {
        if (readingLineRef.current) {
          readingLineRef.current.style.top = `${e.clientY}px`
        }
      }
      document.addEventListener('mousemove', handleMouseMove)
      return () => document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [accessibility.readingLine])

  useEffect(() => {
    if (accessibility.darkMode) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [accessibility.darkMode])

  const accessibilityClasses = [
    accessibility.dyslexiaFont ? 'dyslexia-font' : '',
    accessibility.highContrast ? 'high-contrast' : '',
    accessibility.increasedSpacing ? 'increased-spacing' : '',
    accessibility.reduceMotion ? 'reduce-motion' : ''
  ].filter(Boolean).join(' ')

  const filteredRooms = hotelData.rooms.filter((room) => {
    if (activeFilters.length === 0) return true
    return activeFilters.every((filter) => {
      const key = filter as keyof Room['accessibility']
      return room.accessibility[key] === true
    })
  })

  const toggleAccommodation = (id: string) => {
    if (selectedAccommodations.includes(id)) {
      setSelectedAccommodations(selectedAccommodations.filter(a => a !== id))
    } else {
      setSelectedAccommodations([...selectedAccommodations, id])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    // Generar número de pedido aleatorio (ID)
    const orderNumber = 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    
    // Traducir las acomodaciones al español para que sean legibles
    const translatedAccommodations = selectedAccommodations.map(id => {
      const option = accommodationOptions.find(opt => opt.id === id);
      return option ? option.label : id;
    }).join(', ');

    const reservationData = {
      numero_de_pedido: orderNumber,
      nombre: formData.get('name'),
      email: formData.get('email'),
      telefono: formData.get('phone'),
      habitacion_tipo: formData.get('roomType'),
      habitacion_cantidad: formData.get('quantity'),
      acomodaciones: translatedAccommodations,
      fecha_creacion: new Date().toISOString()
    }

    try {
      console.log('Intentando enviar datos a Firebase...', reservationData);
      const docRef = await addDoc(collection(db, 'reservas'), {
        ...reservationData,
        atendido: false
      })
      console.log('Reserva guardada con ID:', docRef.id);

      // Enviar correo de confirmación vía EmailJS
      try {
        await emailjs.send(
          'service_q8d6ofv',
          'template_o2idr4j',
          {
            nombre: reservationData.nombre,
            email: reservationData.email,
            numero_de_pedido: reservationData.numero_de_pedido,
            habitacion_tipo: reservationData.habitacion_tipo,
            habitacion_cantidad: reservationData.habitacion_cantidad,
            acomodaciones: reservationData.acomodaciones
          },
          'TTS9BrBBr92hi-UHq'
        );
        console.log('Correo de confirmación enviado exitosamente');
      } catch (emailError) {
        console.error('Error al enviar el correo:', emailError);
      }

      const successMsg = `¡Mensaje enviado correctamente! Su número de pedido es: ${orderNumber}`
      alert(successMsg)
      announce(successMsg)
      
      setSelectedAccommodations([])
      form.reset()
    } catch (error: any) {
      console.error('Error detallado de Firebase:', error)
      alert(`Error al enviar: ${error.message}`)
      announce(`Error al enviar: ${error.message}`)
    }
  }

  const handleSearchReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchOrder.trim()) return

    setIsSearching(true)
    setFoundReservation(null)

    try {
      const q = query(collection(db, 'reservas'), where('numero_de_pedido', '==', searchOrder.trim().toUpperCase()))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        announce('No se encontró ninguna reserva con ese número de pedido.')
      } else {
        const doc = querySnapshot.docs[0]
        setFoundReservation({ id: doc.id, ...doc.data() })
        announce('Reserva encontrada.')
      }
    } catch (error) {
      announce('Error al buscar la reserva.')
    } finally {
      setIsSearching(false)
    }
  }

  const selectedFacilityData = hotelData.facilities.find(f => f.id === selectedFacility)

  const instalacionesText = `Instalaciones del Hotel. ${hotelData.roomsCount} habitaciones de lujo con ${hotelData.plan.toLowerCase()} y todas las amenidades que necesita. ${hotelData.facilities.map(f => `${f.icon} ${f.name}: ${f.description}`).join('. ')}`

  const serviciosText = `Accesibilidad Total. Todas las herramientas que necesitas para una estancia cómoda. ${hotelData.amenities.map(a => `${a.title}: ${a.description}`).join('. ')}`

  const habitacionesText = `Nuestras Habitaciones. Diseñadas para tu comodidad y autonomía. ${filteredRooms.length} habitaciones disponibles. ${filteredRooms.map(r => `${r.name}: ${r.altDescription}. Precio: ${hotelData.currency} ${formatPrice(r.price)} pesos mexicanos por noche.`).join(' ')}`

  const mapaText = `Mapa de Accesibilidad. Punto de interés para personas con discapacidad. Leyenda: Zona de recepción, Zona de habitaciones, Zona de restaurante, Zona de instalaciones, Zona de estacionamiento, Zona exterior. Pulse los puntos en el mapa para más detalles.`

  const contactoText = `Reserva tu estancia. Estamos aquí para ayudarte. Teléfono: ${hotelData.phone}. Correo electrónico: ${hotelData.email}. Dirección: ${hotelData.address}.`

  const testimoniosText = `Lo que dicen nuestros huéspedes. ${hotelData.testimonials.map(t => `${t.name}, ${t.role}: ${t.text}`).join('. ')}`

  if (isAdminView) {
    return (
      <div 
        className={`landing ${accessibilityClasses}`}
        style={{ fontSize: `${accessibility.fontSize}rem`, minHeight: '100vh' }}
      >
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => setIsAdminView(false)} 
            className="btn btn-secondary"
          >
            Volver al Sitio del Hotel
          </button>
        </div>
        <AdminPanel />
      </div>
    )
  }

  return (
    <div
      className={`landing ${accessibilityClasses}`}
      style={{ fontSize: `${accessibility.fontSize}rem` }}
    >
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        id="announcer"
      >
        {announcement}
      </div>

      <AccessibilityToolbar
        state={accessibility}
        onChange={setAccessibility}
        onAnnounce={announce}
      />

      {accessibility.readingLine && (
        <div
          ref={readingLineRef}
          className="reading-line"
          aria-hidden="true"
        />
      )}

      <header className="header" role="banner">
        <div className="container">
          <a href="#inicio" className="logo" aria-label={`${hotelData.name} - Inicio`}>
            <span className="logo-icon" aria-hidden="true">&#x1F3E8;</span>
            <span className="logo-text">{hotelData.name}</span>
          </a>
          <nav className="nav" role="navigation" aria-label="Navegacion principal">
            <a href="#inicio" className="nav-link">Inicio</a>
            <a href="#instalaciones" className="nav-link">Instalaciones</a>
            <a href="#habitaciones" className="nav-link">Habitaciones</a>
            <a href="#mapa" className="nav-link">Mapa</a>
            <a href="#contacto" className="nav-link btn-primary">Reservar</a>
          </nav>
        </div>
      </header>

      <main id="main-content" role="main">
        <section id="inicio" className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-stars">{'★'.repeat(5)}</span>
              <span className="badge-category">{hotelData.category}</span>
              <span className="badge-type">{hotelData.hotelType}</span>
            </div>
            <h1 id="hero-title" className="hero-title">{hotelData.tagline}</h1>
            <p className="hero-description">{hotelData.description}</p>
            <div className="hero-badges">
              <span className="hero-info-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {hotelData.plan}
              </span>
              <span className="hero-info-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 14C8.1 14 9 13.1 9 12C9 10.9 8.1 10 7 10C5.9 10 5 10.9 5 12C5 13.1 5.9 14 7 14ZM19 7H11V15H3V5H1V20H3V17H19V20H21V11C21 8.79 19.21 7 17 7H19ZM19 15H17V9H19V15Z"/>
                </svg>
                {hotelData.roomsCount} habitaciones
              </span>
            </div>
            <div className="hero-buttons">
              <a href="#habitaciones" className="btn btn-primary">Ver Habitaciones</a>
              <a href="#contacto" className="btn btn-secondary">Contactar</a>
              <PageSpeaker rate={accessibility.speechRate} />
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
              alt={`Fachada del ${hotelData.name}, hotel cinco estrellas en ${hotelData.location}`}
            />
          </div>
        </section>

        <section id="instalaciones" className="facilities" aria-labelledby="facilities-title">
          <div className="container">
            <h2 id="facilities-title" className="section-title">
              Instalaciones del Hotel
              <SectionSpeaker text={instalacionesText} rate={accessibility.speechRate} ariaLabel="Leer sección de instalaciones" />
            </h2>
            <p className="section-subtitle">
              {hotelData.roomsCount} habitaciones de lujo con {hotelData.plan.toLowerCase()} y todas las amenidades que necesita
            </p>
            <div className="facilities-grid" role="list">
              {hotelData.facilities.map((facility) => (
                <div
                  key={facility.id}
                  className={`facility-card ${selectedFacility === facility.id ? 'selected' : ''}`}
                  role="listitem"
                  onClick={() => setSelectedFacility(selectedFacility === facility.id ? null : facility.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedFacility(selectedFacility === facility.id ? null : facility.id)
                    }
                  }}
                  tabIndex={0}
                  aria-pressed={selectedFacility === facility.id}
                  aria-label={`${facility.name}. Haga clic para ver más información.`}
                >
                  <span className="facility-icon" aria-hidden="true">{facility.icon}</span>
                  <span className="facility-name">{facility.name}</span>
                </div>
              ))}
            </div>
            {selectedFacilityData && (
              <div className="facility-detail-panel" role="region" aria-label="Detalle de instalación seleccionada">
                <div className="facility-detail-header">
                  <span className="facility-detail-icon" aria-hidden="true">{selectedFacilityData.icon}</span>
                  <h3 className="facility-detail-name">{selectedFacilityData.name}</h3>
                  <button
                    className="facility-detail-close"
                    onClick={() => setSelectedFacility(null)}
                    aria-label="Cerrar detalle"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="facility-detail-description">{selectedFacilityData.description}</p>
              </div>
            )}
          </div>
        </section>

        <section id="servicios" className="features" aria-labelledby="features-title">
          <div className="container">
            <h2 id="features-title" className="section-title">
              Accesibilidad Total
              <SectionSpeaker text={serviciosText} rate={accessibility.speechRate} ariaLabel="Leer sección de servicios" />
            </h2>
            <p className="section-subtitle">Todas las herramientas que necesitas para una estancia comoda</p>
            <div className="features-grid" role="list">
              {hotelData.amenities.map((amenity, index) => (
                <article key={index} className="feature-card" role="listitem">
                  <div className="feature-icon">{amenity.icon}</div>
                  <h3 className="feature-title">{amenity.title}</h3>
                  <p className="feature-description">{amenity.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="habitaciones" className="rooms" aria-labelledby="rooms-title">
          <div className="container">
            <h2 id="rooms-title" className="section-title">
              Nuestras Habitaciones
              <SectionSpeaker text={habitacionesText} rate={accessibility.speechRate} ariaLabel="Leer sección de habitaciones" />
            </h2>
            <p className="section-subtitle">Disenadas para tu comodidad y autonomia</p>

            <RoomFilters
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
              roomCount={filteredRooms.length}
            />

            <div className="rooms-grid">
              {filteredRooms.length === 0 ? (
                <div className="no-rooms-message" role="alert">
                  <p>No se encontraron habitaciones con los filtros seleccionados.</p>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setActiveFilters([])}
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                filteredRooms.map((room, index) => (
                  <article key={index} className="room-card">
                    <div className="room-image">
                      <img src={room.image} alt={room.altDescription} />
                      <div className="room-accessibility-badges">
                        {room.accessibility.wheelchairAccessible && (
                          <span className="access-badge" title="Espacio para silla de ruedas">♿</span>
                        )}
                        {room.accessibility.rollInShower && (
                          <span className="access-badge" title="Ducha a ras de suelo">🚿</span>
                        )}
                        {room.accessibility.grabBars && (
                          <span className="access-badge" title="Barras de apoyo">🦯</span>
                        )}
                        {room.accessibility.visualAlarms && (
                          <span className="access-badge" title="Alarmas visuales">👁</span>
                        )}
                        {room.accessibility.hearingLoop && (
                          <span className="access-badge" title="Bucle magnetico">🔊</span>
                        )}
                      </div>
                    </div>
                    <div className="room-content">
                      <h3 className="room-title">{room.name}</h3>
                      <ul className="room-features">
                        {room.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                      <div className="room-price">
                        <span className="price" aria-label={`Precio: ${formatPrice(room.price)} pesos mexicanos por noche`}>
                          {hotelData.currency} ${formatPrice(room.price)}
                        </span>
                        <span className="per-night">/noche</span>
                      </div>
                      <button className="btn btn-primary">Reservar</button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <section id="mapa" aria-labelledby="map-title">
          <div className="container">
            <h2 id="map-title" className="section-title">
              Mapa de Accesibilidad
              <SectionSpeaker text={mapaText} rate={accessibility.speechRate} ariaLabel="Leer sección del mapa" />
            </h2>
            <p className="section-subtitle">Navega por nuestras instalaciones adaptadas</p>
          </div>
          <AccessibilityMap />
        </section>

        <section id="testimonios" className="testimonials" aria-labelledby="testimonials-title">
          <div className="container">
            <h2 id="testimonials-title" className="section-title">
              Lo que dicen nuestros huespedes
              <SectionSpeaker text={testimoniosText} rate={accessibility.speechRate} ariaLabel="Leer sección de testimonios" />
            </h2>
            <div className="testimonials-grid">
              {hotelData.testimonials.map((testimonial, index) => (
                <article key={index} className="testimonial-card">
                  <div className="testimonial-stars" aria-label={`Calificacion: ${testimonial.rating} de 5 estrellas`}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} filled />
                    ))}
                  </div>
                  <blockquote className="testimonial-text">
                    <p>{testimonial.text}</p>
                  </blockquote>
                  <footer className="testimonial-author">
                    <div className="author-avatar" aria-hidden="true">{testimonial.name[0]}</div>
                    <div className="author-info">
                      <cite className="author-name">{testimonial.name}</cite>
                      <p className="author-role">{testimonial.role}</p>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="consultar-reserva" className="search-reservation">
          <div className="container">
            <div className="search-box">
              <h2 className="section-title">Consultar mi Reserva</h2>
              <p className="section-subtitle">Ingrese su número de pedido para verificar el estado</p>
              <form onSubmit={handleSearchReservation} className="search-form">
                <input 
                  type="text" 
                  placeholder="Ej: RES-X7H2J9L1" 
                  value={searchOrder}
                  onChange={(e) => setSearchOrder(e.target.value)}
                  className="form-input"
                />
                <button type="submit" className="btn btn-secondary" disabled={isSearching}>
                  {isSearching ? 'Buscando...' : 'Buscar Reserva'}
                </button>
              </form>

              {foundReservation && (
                <div className="reservation-result-card animate-fade-in">
                  <div className="result-header">
                    <span className={`status-badge ${foundReservation.atendido ? 'atendido' : 'pendiente'}`}>
                      {foundReservation.atendido ? 'Confirmado / Atendido' : 'Pendiente de Revisión'}
                    </span>
                    <h3>Detalles de la Reserva</h3>
                  </div>
                  <div className="result-body">
                    <p><strong>Número de Pedido:</strong> <span className="order-id">{foundReservation.numero_de_pedido}</span></p>
                    <p><strong>Titular:</strong> {foundReservation.nombre}</p>
                    <p><strong>Correo:</strong> {foundReservation.email}</p>
                    <p><strong>Teléfono:</strong> {foundReservation.telefono}</p>
                    <p><strong>Habitación:</strong> {foundReservation.habitacion_tipo} ({foundReservation.habitacion_cantidad} unidad/es)</p>
                    <p><strong>Solicitudes de Accesibilidad:</strong> {foundReservation.acomodaciones || 'Ninguna'}</p>
                    <p><strong>Fecha de Reserva:</strong> {new Date(foundReservation.fecha_creacion).toLocaleString('es-MX')}</p>
                  </div>
                  <button onClick={() => setFoundReservation(null)} className="btn-close-result">Cerrar Detalles</button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="contacto" className="contact" aria-labelledby="contact-title">
          <div className="container">
            <div className="contact-content">
              <h2 id="contact-title" className="section-title">
                Reserva tu estancia
                <SectionSpeaker text={contactoText} rate={accessibility.speechRate} ariaLabel="Leer sección de contacto" />
              </h2>
              <p className="section-subtitle">Estamos aqui para ayudarte</p>
              <address className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon" aria-hidden="true">&#x1F4DE;</span>
                  <a href={`tel:${hotelData.phone}`}>{hotelData.phone}</a>
                </div>
                <div className="contact-item">
                  <span className="contact-icon" aria-hidden="true">&#x2709;&#xFE0F;</span>
                  <a href={`mailto:${hotelData.email}`}>{hotelData.email}</a>
                </div>
                <div className="contact-item">
                  <span className="contact-icon" aria-hidden="true">&#x1F4CD;</span>
                  <span>{hotelData.address}</span>
                </div>
              </address>
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="contact-name">Nombre completo</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    placeholder="Maria Garcia"
                    className="form-input"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">Correo electronico</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    placeholder="maria@ejemplo.com"
                    className="form-input"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="room-type">Tipo de Habitación</label>
                    <select id="room-type" name="roomType" className="form-input" required>
                      <option value="">Seleccione una opción</option>
                      {hotelData.rooms.map((room) => (
                        <option key={room.name} value={room.name}>
                          {room.name} - ${formatPrice(room.price)} {hotelData.currency}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="room-quantity">Cantidad</label>
                    <input
                      type="number"
                      id="room-quantity"
                      name="quantity"
                      min="1"
                      max="5"
                      defaultValue="1"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-phone">Telefono</label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    placeholder="+52 55 0000 0000"
                    className="form-input"
                    autoComplete="tel"
                  />
                </div>

                <fieldset className="accommodation-fieldset">
                  <legend className="accommodation-legend">Solicitudes de Acomodacion Especial</legend>
                  <p className="accommodation-description">
                    Seleccione los servicios de accesibilidad que requiera durante su estancia
                  </p>
                  <div className="accommodation-options">
                    {accommodationOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`accommodation-option ${selectedAccommodations.includes(option.id) ? 'selected' : ''}`}
                        htmlFor={`accommodation-${option.id}`}
                      >
                        <input
                          type="checkbox"
                          id={`accommodation-${option.id}`}
                          name="accommodations"
                          value={option.id}
                          checked={selectedAccommodations.includes(option.id)}
                          onChange={() => toggleAccommodation(option.id)}
                          className="accommodation-checkbox"
                        />
                        <div className="accommodation-content">
                          <span className="accommodation-label">{option.label}</span>
                          <span className="accommodation-desc">{option.description}</span>
                        </div>
                        <span className="accommodation-check" aria-hidden="true">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="form-group">
                  <label htmlFor="contact-message">Otras necesidades o comentarios</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Indique cualquier otra necesidad especial de accesibilidad..."
                    className="form-input form-textarea"
                    rows={3}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Enviar Solicitud</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-icon" aria-hidden="true">&#x1F3E8;</span>
              <span className="logo-text">{hotelData.name}</span>
            </div>
            <p className="footer-text">&copy; 2024 {hotelData.name}. {hotelData.category}. Todos los derechos reservados.</p>
            <nav className="footer-links" aria-label="Enlaces legales">
              <a href="#">Politica de Privacidad</a>
              <a href="#">Terminos de Servicio</a>
              <a href="#">Accesibilidad</a>
              <button 
                onClick={() => setIsAdminView(true)} 
                className="admin-access-link"
                style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  color: '#fff', 
                  cursor: 'pointer', 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  marginLeft: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>🔐</span> Administracion
              </button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App