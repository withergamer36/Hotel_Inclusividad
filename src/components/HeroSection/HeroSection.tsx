import type { TFunction } from 'react-i18next'

interface HotelDataForHero {
  category: string
  hotelType: string
  tagline: string
  description: string
  plan: string
  roomsCount: number
  name: string
  location: string
  heroImageAlt: string
}

interface HeroSectionProps {
  hotelData: HotelDataForHero
  PageSpeakerComponent: any
  speechRate: number
  speechLang: string
  t: TFunction
  formatPrice: (price: number) => string
}

export function HeroSection({ hotelData, PageSpeakerComponent, speechRate, speechLang, t }: HeroSectionProps) {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-stars">{'\u2605'.repeat(5)}</span>
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
            {hotelData.roomsCount} {t('hero.roomsCountLabel')}
          </span>
        </div>
        <div className="hero-buttons">
          <a href="#habitaciones" className="btn btn-primary">{t('hero.viewRooms')}</a>
          <a href="#contacto" className="btn btn-secondary">{t('hero.contact')}</a>
          <PageSpeakerComponent rate={speechRate} speechLang={speechLang} />
        </div>
      </div>
      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
          alt={hotelData.heroImageAlt}
          loading="lazy"
        />
      </div>
    </section>
  )
}
