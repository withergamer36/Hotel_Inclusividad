import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityToolbar, type AccessibilityState } from '../AccessibilityToolbar/AccessibilityToolbar'
import { RoomFilters } from '../RoomFilters/RoomFilters'
import { AccessibilityMap } from '../AccessibilityMap/AccessibilityMap'
import { useHotelData, type Room } from '../../i18n/useHotelData'
import { db } from '../../lib/firebase'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import emailjs from '@emailjs/browser'
import { HeroSection } from '../HeroSection/HeroSection'
import { AdminPanel } from '../AdminPanel/AdminPanel'
import { Toaster, toast } from 'react-hot-toast'
import { VoiceNavigator } from '../VoiceNavigator/VoiceNavigator'
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

function useFormatPrice() {
  const { i18n } = useTranslation()
  const locale = i18n.language === 'en' ? 'en-US' : 'es-MX'
  return (price: number): string => price.toLocaleString(locale)
}

function useSpeechLang() {
  const { i18n } = useTranslation()
  return i18n.language === 'en' ? 'en-US' : 'es-ES'
}

interface SectionSpeakerProps {
  text: string
  rate: number
  ariaLabel: string
  speechLang: string
}

function SectionSpeaker({ text, rate, ariaLabel, speechLang }: SectionSpeakerProps) {
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
    utterance.lang = speechLang
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

function PageSpeaker({ rate, speechLang }: { rate: number; speechLang: string }) {
  const { t } = useTranslation()
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
      utterance.lang = speechLang
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
      aria-label={isSpeaking ? t('speaker.stopPage') : t('speaker.readPage')}
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
  const { t, i18n } = useTranslation()
  const { hotelData, accommodationOptions } = useHotelData()
  const formatPrice = useFormatPrice()
  const speechLang = useSpeechLang()

  const [accessibility, setAccessibility] = useState<AccessibilityState>({
    fontSize: 1,
    dyslexiaFont: false,
    highContrast: false,
    darkMode: false,
    reduceMotion: false,
    increasedSpacing: false,
    readingLine: false,
    isSpeaking: false,
    speechRate: 1,
    colorBlindMode: 'none',
    immersiveReading: false,
    largeCursor: false,
    highlightLinks: false
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

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  const accessibilityClasses = [
    accessibility.dyslexiaFont ? 'dyslexia-font' : '',
    accessibility.highContrast ? 'high-contrast' : '',
    accessibility.increasedSpacing ? 'increased-spacing' : '',
    accessibility.reduceMotion ? 'reduce-motion' : '',
    accessibility.colorBlindMode && accessibility.colorBlindMode !== 'none' ? `cb-${accessibility.colorBlindMode}` : '',
    accessibility.immersiveReading ? 'immersive-reading' : '',
    accessibility.largeCursor ? 'large-cursor' : '',
    accessibility.highlightLinks ? 'highlight-links' : ''
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

    const orderNumber = 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase()

    const translatedAccommodations = selectedAccommodations.map(id => {
      const option = accommodationOptions.find(opt => opt.id === id);
      return option ? option.label : id;
    }).join(', ');

    const roomTypeValue = formData.get('roomType') as string
    const quantityValue = Number(formData.get('quantity')) || 1
    const selectedRoom = hotelData.rooms.find(r => r.name === roomTypeValue)
    const precioTotal = selectedRoom ? selectedRoom.price * quantityValue : 0
    const precioTotalFormatted = `${hotelData.currency} $${formatPrice(precioTotal)}`

    const reservationData = {
      numero_de_pedido: orderNumber,
      nombre: formData.get('name'),
      email: formData.get('email'),
      telefono: formData.get('phone'),
      habitacion_tipo: roomTypeValue,
      habitacion_cantidad: quantityValue,
      checkIn: formData.get('checkIn'),
      checkOut: formData.get('checkOut'),
      acomodaciones: translatedAccommodations,
      precio_total: precioTotal,
      fecha_creacion: new Date().toISOString()
    }

    try {
      console.log('Intentando enviar datos a Firebase...', reservationData);
      const docRef = await addDoc(collection(db, 'reservas'), {
        ...reservationData,
        atendido: false
      })
      console.log('Reserva guardada con ID:', docRef.id);

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
            checkIn: reservationData.checkIn,
            checkOut: reservationData.checkOut,
            acomodaciones: reservationData.acomodaciones,
            precio_total: precioTotalFormatted
          },
          'TTS9BrBBr92hi-UHq'
        );
        console.log('Correo de confirmación enviado exitosamente');
      } catch (emailError) {
        console.error('Error al enviar el correo:', emailError);
      }

      const successMsg = t('reservation.success', { orderNumber })
      alert(successMsg)
      announce(successMsg)

      setSelectedAccommodations([])
      form.reset()
    } catch (error: any) {
      console.error('Error detallado de Firebase:', error)
      const errorMsg = t('reservation.error', { error: error.message })
      alert(errorMsg)
      announce(errorMsg)
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
        toast.error(t('search.notFound'))
        announce(t('search.notFound'))
      } else {
        const doc = querySnapshot.docs[0]
        setFoundReservation({ id: doc.id, ...doc.data() })
        toast.success(t('search.found'))
        announce(t('search.foundAnnounce'))
      }
    } catch {
      toast.error(t('search.error'))
      announce(t('search.error'))
    } finally {
      setIsSearching(false)
    }
  }

  const selectedFacilityData = hotelData.facilities.find(f => f.id === selectedFacility)

  const instalacionesText = `${t('facilitiesSection.title')}. ${hotelData.roomsCount} ${t('facilitiesSection.subtitle', { count: hotelData.roomsCount, plan: hotelData.plan.toLowerCase() })}. ${hotelData.facilities.map(f => `${f.name}: ${f.description}`).join('. ')}`

  const serviciosText = `${t('amenitiesSection.title')}. ${t('amenitiesSection.subtitle')}. ${hotelData.amenities.map(a => `${a.title}: ${a.description}`).join('. ')}`

  const habitacionesText = `${t('roomsSection.title')}. ${t('roomsSection.subtitle')}. ${filteredRooms.length} ${t('roomsSection.subtitle').toLowerCase()}. ${filteredRooms.map(r => `${r.name}: ${r.altDescription}. ${t('roomsSection.priceAriaLabel', { price: formatPrice(r.price) })}.`).join(' ')}`

  const mapaText = `${t('map.title')}. ${t('map.subtitle')}.`

  const contactoText = `${t('reservation.title')}. ${t('reservation.subtitle')}. ${t('hotel.phone')}: ${hotelData.phone}. ${t('search.labels.email')}: ${hotelData.email}. ${t('hotel.address')}: ${hotelData.address}.`

  const testimoniosText = `${t('testimonialsSection.title')}. ${hotelData.testimonials.map(test => `${test.name}, ${test.role}: ${test.text}`).join('. ')}`

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
            {t('footer.backToSite')}
          </button>
        </div>
        <AccessibilityToolbar
          state={accessibility}
          onChange={setAccessibility}
          onAnnounce={announce}
        />
        <AdminPanel />
      </div>
    )
  }

  return (
    <div
      className={`landing ${accessibilityClasses}`}
      style={{ fontSize: `${accessibility.fontSize}rem` }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <VoiceNavigator />
      <a href="#main-content" className="skip-link">
        {t('skipLink')}
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
          <a href="#inicio" className="logo" aria-label={t('nav.logoAriaLabel')}>
            <span className="logo-icon" aria-hidden="true">{'\u{1F3E8}'}</span>
            <span className="logo-text">{hotelData.name}</span>
          </a>
          <nav className="nav" role="navigation" aria-label={t('nav.ariaLabel')}>
            <a href="#inicio" className="nav-link">{t('nav.inicio')}</a>
            <a href="#instalaciones" className="nav-link">{t('nav.instalaciones')}</a>
            <a href="#habitaciones" className="nav-link">{t('nav.habitaciones')}</a>
            <a href="#mapa" className="nav-link">{t('nav.mapa')}</a>
            <a href="#contacto" className="nav-link btn-primary">{t('nav.reservar')}</a>
          </nav>
        </div>
      </header>

      <main id="main-content" role="main">
        <HeroSection
          hotelData={hotelData}
          PageSpeakerComponent={PageSpeaker}
          speechRate={accessibility.speechRate}
          speechLang={speechLang}
          t={t}
          formatPrice={formatPrice}
        />

        <section id="instalaciones" className="facilities" aria-labelledby="facilities-title">
          <div className="container">
            <h2 id="facilities-title" className="section-title">
              {t('facilitiesSection.title')}
              <SectionSpeaker text={instalacionesText} rate={accessibility.speechRate} ariaLabel={t('speaker.facilitiesSection')} speechLang={speechLang} />
            </h2>
            <p className="section-subtitle">
              {t('facilitiesSection.subtitle', { count: hotelData.roomsCount, plan: hotelData.plan.toLowerCase() })}
            </p>
            <div className="facilities-grid" role="list">
              {hotelData.facilities.map((facility) => (
                <button
                  key={facility.id}
                  className={`facility-card ${selectedFacility === facility.id ? 'selected' : ''}`}
                  role="listitem"
                  onClick={() => setSelectedFacility(selectedFacility === facility.id ? null : facility.id)}
                  aria-pressed={selectedFacility === facility.id}
                  aria-label={`${facility.name}. ${selectedFacility === facility.id ? t('facilitiesSection.collapseDetails') : t('facilitiesSection.expandDetails')}`}
                >
                  <span className="facility-icon" aria-hidden="true">{facility.icon}</span>
                  <span className="facility-name">{facility.name}</span>
                </button>
              ))}
            </div>
            {selectedFacilityData && (
              <div className="facility-detail-panel" role="region" aria-label={t('facilitiesSection.detailRegion')}>
                <div className="facility-detail-header">
                  <span className="facility-detail-icon" aria-hidden="true">{selectedFacilityData.icon}</span>
                  <h3 className="facility-detail-name">{selectedFacilityData.name}</h3>
                  <button
                    className="facility-detail-close"
                    onClick={() => setSelectedFacility(null)}
                    aria-label={t('facilitiesSection.closeDetail')}
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
              {t('amenitiesSection.title')}
              <SectionSpeaker text={serviciosText} rate={accessibility.speechRate} ariaLabel={t('speaker.amenitiesSection')} speechLang={speechLang} />
            </h2>
            <p className="section-subtitle">{t('amenitiesSection.subtitle')}</p>
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
              {t('roomsSection.title')}
              <SectionSpeaker text={habitacionesText} rate={accessibility.speechRate} ariaLabel={t('speaker.roomsSection')} speechLang={speechLang} />
            </h2>
            <p className="section-subtitle">{t('roomsSection.subtitle')}</p>

            <RoomFilters
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
              roomCount={filteredRooms.length}
            />

            <div className="rooms-grid">
              {filteredRooms.length === 0 ? (
                <div className="no-rooms-message" role="alert">
                  <p>{t('roomsSection.noRoomsFound')}</p>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setActiveFilters([])}
                  >
                    {t('roomsSection.clearFilters')}
                  </button>
                </div>
              ) : (
                filteredRooms.map((room, index) => (
                  <article key={index} className="room-card">
                    <div className="room-image">
                      <img src={room.image} alt={room.altDescription} loading="lazy" />
                      <div className="room-accessibility-badges">
                        {room.accessibility.wheelchairAccessible && (
                          <span className="access-badge" title={t('roomAccessBadges.wheelchairAccessible')}>{'\u267F'}</span>
                        )}
                        {room.accessibility.rollInShower && (
                          <span className="access-badge" title={t('roomAccessBadges.rollInShower')}>{'\u{1F6BF}'}</span>
                        )}
                        {room.accessibility.grabBars && (
                          <span className="access-badge" title={t('roomAccessBadges.grabBars')}>{'\u{1F9AF}'}</span>
                        )}
                        {room.accessibility.visualAlarms && (
                          <span className="access-badge" title={t('roomAccessBadges.visualAlarms')}>{'\u{1F441}'}</span>
                        )}
                        {room.accessibility.hearingLoop && (
                          <span className="access-badge" title={t('roomAccessBadges.hearingLoop')}>{'\u{1F50A}'}</span>
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
                        <span className="price" aria-label={t('roomsSection.priceAriaLabel', { price: formatPrice(room.price) })}>
                          {hotelData.currency} ${formatPrice(room.price)}
                        </span>
                        <span className="per-night">{t('roomsSection.perNight')}</span>
                      </div>
                      <button className="btn btn-primary">{t('roomsSection.reserve')}</button>
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
              {t('map.title')}
              <SectionSpeaker text={mapaText} rate={accessibility.speechRate} ariaLabel={t('speaker.mapSection')} speechLang={speechLang} />
            </h2>
            <p className="section-subtitle">{t('map.subtitle')}</p>
          </div>
          <AccessibilityMap />
        </section>

        <section id="testimonios" className="testimonials" aria-labelledby="testimonials-title">
          <div className="container">
            <h2 id="testimonials-title" className="section-title">
              {t('testimonialsSection.title')}
              <SectionSpeaker text={testimoniosText} rate={accessibility.speechRate} ariaLabel={t('speaker.testimonialsSection')} speechLang={speechLang} />
            </h2>
            <div className="testimonials-grid">
              {hotelData.testimonials.map((testimonial, index) => (
                <article key={index} className="testimonial-card">
                  <div className="testimonial-stars" aria-label={t('testimonialsSection.ratingAria', { rating: testimonial.rating })}>
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
              <h2 className="section-title">{t('search.title')}</h2>
              <p className="section-subtitle">{t('search.subtitle')}</p>
              <form onSubmit={handleSearchReservation} className="search-form">
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={searchOrder}
                  onChange={(e) => setSearchOrder(e.target.value)}
                  className="form-input"
                />
                <button type="submit" className="btn btn-secondary" disabled={isSearching} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  {isSearching ? (
                    <>
                      <svg className="spinner" viewBox="0 0 50 50" width="20" height="20">
                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                      </svg>
                      {t('search.searching')}
                    </>
                  ) : t('search.button')}
                </button>
              </form>

              {foundReservation && (
                <div className="reservation-result-card animate-fade-in">
                  <div className="result-header">
                    <span className={`status-badge ${foundReservation.atendido ? 'atendido' : 'pendiente'}`}>
                      {foundReservation.atendido ? t('search.confirmed') : t('search.pending')}
                    </span>
                    <h3>{t('search.detailsTitle')}</h3>
                  </div>
                  <div className="result-body">
                    <p><strong>{t('search.labels.orderNumber')}:</strong> <span className="order-id">{foundReservation.numero_de_pedido}</span></p>
                    <p><strong>{t('search.labels.holder')}:</strong> {foundReservation.nombre}</p>
                    <p><strong>{t('search.labels.email')}:</strong> {foundReservation.email}</p>
                    <p><strong>{t('search.labels.phone')}:</strong> {foundReservation.telefono}</p>
                    <p><strong>{t('search.labels.dates')}:</strong> {t('search.labels.datesValue', { checkIn: foundReservation.checkIn, checkOut: foundReservation.checkOut })}</p>
                    <p><strong>{t('search.labels.room')}:</strong> {foundReservation.habitacion_tipo} ({t('search.labels.quantity', { type: foundReservation.habitacion_tipo, qty: foundReservation.habitacion_cantidad })})</p>
                    <p><strong>{t('search.labels.total')}:</strong> {hotelData.currency} ${formatPrice(foundReservation.precio_total || 0)}</p>
                    <p><strong>{t('search.labels.accessibility')}:</strong> {foundReservation.acomodaciones || t('search.labels.none')}</p>
                    <p><strong>{t('search.labels.reservationDate')}:</strong> {new Date(foundReservation.fecha_creacion).toLocaleString(i18n.language === 'en' ? 'en-US' : 'es-MX')}</p>
                  </div>
                  <button onClick={() => setFoundReservation(null)} className="btn-close-result">{t('search.close')}</button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="contacto" className="contact" aria-labelledby="contact-title">
          <div className="container">
            <div className="contact-content">
              <h2 id="contact-title" className="section-title">
                {t('reservation.title')}
                <SectionSpeaker text={contactoText} rate={accessibility.speechRate} ariaLabel={t('speaker.contactSection')} speechLang={speechLang} />
              </h2>
              <p className="section-subtitle">{t('reservation.subtitle')}</p>
              <address className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon" aria-hidden="true">{'\u{1F4DE}'}</span>
                  <a href={`tel:${hotelData.phone}`}>{hotelData.phone}</a>
                </div>
                <div className="contact-item">
                  <span className="contact-icon" aria-hidden="true">{'\u2709\uFE0F'}</span>
                  <a href={`mailto:${hotelData.email}`}>{hotelData.email}</a>
                </div>
                <div className="contact-item">
                  <span className="contact-icon" aria-hidden="true">{'\u{1F4CD}'}</span>
                  <span>{hotelData.address}</span>
                </div>
              </address>
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="contact-name">{t('reservation.formLabels.name')}</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    placeholder={t('reservation.placeholders.name')}
                    className="form-input"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">{t('reservation.formLabels.email')}</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    placeholder={t('reservation.placeholders.email')}
                    className="form-input"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="room-type">{t('reservation.formLabels.roomType')}</label>
                    <select id="room-type" name="roomType" className="form-input" required>
                      <option value="">{t('reservation.placeholders.selectRoom')}</option>
                      {hotelData.rooms.map((room) => (
                        <option key={room.name} value={room.name}>
                          {room.name} - ${formatPrice(room.price)} {hotelData.currency}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="room-quantity">{t('reservation.formLabels.quantity')}</label>
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

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="check-in">{t('reservation.formLabels.checkIn')}</label>
                    <input
                      type="date"
                      id="check-in"
                      name="checkIn"
                      className="form-input"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="check-out">{t('reservation.formLabels.checkOut')}</label>
                    <input
                      type="date"
                      id="check-out"
                      name="checkOut"
                      className="form-input"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-phone">{t('reservation.formLabels.phone')}</label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    placeholder={t('reservation.placeholders.phone')}
                    className="form-input"
                    autoComplete="tel"
                  />
                </div>

                <fieldset className="accommodation-fieldset">
                  <legend className="accommodation-legend">{t('reservation.formLabels.accommodations')}</legend>
                  <p className="accommodation-description">
                    {t('reservation.formLabels.accommodationsDesc')}
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
                  <label htmlFor="contact-message">{t('reservation.formLabels.message')}</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder={t('reservation.placeholders.message')}
                    className="form-input form-textarea"
                    rows={3}
                  />
                </div>
                <button type="submit" className="btn btn-primary">{t('reservation.submit')}</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-icon" aria-hidden="true">{'\u{1F3E8}'}</span>
              <span className="logo-text">{hotelData.name}</span>
            </div>
            <p className="footer-text">{t('footer.copyright', { name: hotelData.name, category: hotelData.category })}</p>
            <nav className="footer-links" aria-label={t('footer.ariaLabel')}>
              <a href="#">{t('footer.privacy')}</a>
              <a href="#">{t('footer.terms')}</a>
              <a href="#">{t('footer.accessibility')}</a>
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
                <span>{'\u{1F510}'}</span> {t('footer.admin')}
              </button>
            </nav>
          </div>
        </div>
      </footer>
      <svg style={{ height: 0, width: 0, position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="achromatopsia">
            <feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0, 0, 0, 1, 0" />
          </filter>
        </defs>
      </svg>
    </div>
  )
}

export default App
