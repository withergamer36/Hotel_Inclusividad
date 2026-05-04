import { hotelData } from '../../data/hotelData'

// Nota: Importamos el PageSpeaker simplificado o lo pasamos como prop.
// Por ahora mantendremos el diseño estático principal aquí.
export function HeroSection({ PageSpeakerComponent, speechRate }: { PageSpeakerComponent: any, speechRate: number }) {
  return (
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
          <PageSpeakerComponent rate={speechRate} />
        </div>
      </div>
      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
          alt={`Fachada del ${hotelData.name}, hotel cinco estrellas en ${hotelData.location}`}
          loading="lazy"
        />
      </div>
    </section>
  )
}
