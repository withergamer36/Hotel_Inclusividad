import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './AccessibilityMap.css'

interface MapPoint {
  id: string
  label: string
  description: string
  x: number
  y: number
  icon: 'entrance' | 'reception' | 'elevator' | 'bathroom' | 'exit' | 'pool' | 'spa' | 'gym' | 'restaurant' | 'kitchen' | 'room' | 'parking' | 'route'
  category: 'entrance' | 'vertical' | 'bathroom' | 'emergency' | 'room' | 'recreation' | 'route'
}

function useMapPoints(t: (key: string) => string): MapPoint[] {
  return [
    {
      id: 'main-entrance',
      label: t('map.points.main-entrance.label'),
      description: t('map.points.main-entrance.description'),
      x: 440, y: 535, icon: 'entrance', category: 'entrance'
    },
    {
      id: 'parking-spot-1',
      label: t('map.points.parking-spot-1.label'),
      description: t('map.points.parking-spot-1.description'),
      x: 75, y: 485, icon: 'parking', category: 'entrance'
    },
    {
      id: 'parking-spot-2',
      label: t('map.points.parking-spot-2.label'),
      description: t('map.points.parking-spot-2.description'),
      x: 75, y: 545, icon: 'parking', category: 'entrance'
    },
    {
      id: 'emergency-exit-north',
      label: t('map.points.emergency-exit-north.label'),
      description: t('map.points.emergency-exit-north.description'),
      x: 60, y: 350, icon: 'exit', category: 'emergency'
    },
    {
      id: 'reception',
      label: t('map.points.reception.label'),
      description: t('map.points.reception.description'),
      x: 400, y: 460, icon: 'reception', category: 'entrance'
    },
    {
      id: 'main-elevator',
      label: t('map.points.main-elevator.label'),
      description: t('map.points.main-elevator.description'),
      x: 520, y: 460, icon: 'elevator', category: 'vertical'
    },
    {
      id: 'lobby-bathroom',
      label: t('map.points.lobby-bathroom.label'),
      description: t('map.points.lobby-bathroom.description'),
      x: 280, y: 460, icon: 'bathroom', category: 'bathroom'
    },
    {
      id: 'pool',
      label: t('map.points.pool.label'),
      description: t('map.points.pool.description'),
      x: 400, y: 300, icon: 'pool', category: 'recreation'
    },
    {
      id: 'spa',
      label: t('map.points.spa.label'),
      description: t('map.points.spa.description'),
      x: 560, y: 280, icon: 'spa', category: 'recreation'
    },
    {
      id: 'gym',
      label: t('map.points.gym.label'),
      description: t('map.points.gym.description'),
      x: 560, y: 350, icon: 'gym', category: 'recreation'
    },
    {
      id: 'restaurant',
      label: t('map.points.restaurant.label'),
      description: t('map.points.restaurant.description'),
      x: 505, y: 137, icon: 'restaurant', category: 'recreation'
    },
    {
      id: 'kitchen-bathrooms',
      label: t('map.points.kitchen-bathrooms.label'),
      description: t('map.points.kitchen-bathrooms.description'),
      x: 700, y: 520, icon: 'kitchen', category: 'recreation'
    },
    {
      id: 'rooms-floor-3-a',
      label: t('map.points.rooms-floor-3-a.label'),
      description: t('map.points.rooms-floor-3-a.description'),
      x: 150, y: 200, icon: 'room', category: 'room'
    },
    {
      id: 'rooms-floor-3-b',
      label: t('map.points.rooms-floor-3-b.label'),
      description: t('map.points.rooms-floor-3-b.description'),
      x: 150, y: 125, icon: 'room', category: 'room'
    },
    {
      id: 'rooms-floor-4-a',
      label: t('map.points.rooms-floor-4-a.label'),
      description: t('map.points.rooms-floor-4-a.description'),
      x: 300, y: 200, icon: 'room', category: 'room'
    },
    {
      id: 'rooms-floor-4-b',
      label: t('map.points.rooms-floor-4-b.label'),
      description: t('map.points.rooms-floor-4-b.description'),
      x: 300, y: 125, icon: 'room', category: 'room'
    },
    {
      id: 'floor-bathroom',
      label: t('map.points.floor-bathroom.label'),
      description: t('map.points.floor-bathroom.description'),
      x: 220, y: 260, icon: 'bathroom', category: 'bathroom'
    },
    {
      id: 'route-lobby-pool',
      label: t('map.points.route-lobby-pool.label'),
      description: t('map.points.route-lobby-pool.description'),
      x: 400, y: 380, icon: 'route', category: 'route'
    },
    {
      id: 'events-room',
      label: t('map.points.events-room.label'),
      description: t('map.points.events-room.description'),
      x: 687, y: 137, icon: 'entrance', category: 'recreation'
    },
    {
      id: 'meeting-rooms',
      label: t('map.points.meeting-rooms.label'),
      description: t('map.points.meeting-rooms.description'),
      x: 505, y: 227, icon: 'entrance', category: 'recreation'
    },
    {
      id: 'laundry-service',
      label: t('map.points.laundry-service.label'),
      description: t('map.points.laundry-service.description'),
      x: 687, y: 205, icon: 'entrance', category: 'recreation'
    },
    {
      id: 'pharmacy-service',
      label: t('map.points.pharmacy-service.label'),
      description: t('map.points.pharmacy-service.description'),
      x: 687, y: 250, icon: 'entrance', category: 'recreation'
    }
  ]
}

function MapIcon({ type, className }: { type: MapPoint['icon']; className?: string }) {
  switch (type) {
    case 'entrance':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M11 6L6 14H8L9.5 11.5L11 14V6ZM13 14V11.5L14.5 14H16L11 6V4H6V6H11L16 14H13ZM20 20H4V18H20V20Z" />
        </svg>
      )
    case 'reception':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C14.21 2 16 3.79 16 6C16 7.5 15.2 8.77 14 9.46V11H15V13H14V14.54C14 16.07 13.05 17.43 11.63 18H12.35C13.77 17.43 14.72 16.07 14.72 14.54V13H9V11H14V9.46C12.8 8.77 12 7.5 12 6C12 3.79 13.79 2 16 2H19V4H16.55C16.1 4.9 15.37 5.67 14.5 6.19V9H16V11H14.28L15.5 12.77L16.72 11H15V9H16.5C15.37 8.67 14.37 7.92 13.7 6.93L15.05 6H19V2H12ZM10 5H12L12.45 5.74L13 7H11L10.55 6.26L10 5ZM4 9H9V11H4V9ZM4 13H9V15H4V13ZM4 17H9V19H4V17Z" />
        </svg>
      )
    case 'elevator':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 3H5V7H9V21H15V7H19V3ZM12 5V11H7V5H12ZM17 19H12V13H17V19Z" />
        </svg>
      )
    case 'bathroom':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 7H9V9H7V7ZM7 11H9V13H7V11ZM11 7H13V9H11V7ZM11 11H13V13H11V11ZM15 7H17V9H15V7ZM15 11H17V13H15V11ZM7 15H9V17H7V15ZM11 15H13V17H11V15ZM15 15H17V17H15V15Z" />
        </svg>
      )
    case 'exit':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M10.09 15.59L11.5 17L16.5 12L11.5 7L10.09 8.41L12.67 11H3V13H12.67L10.09 15.59ZM19 12V14H21V17H19V19H17V17H15V14H17V12H19Z" />
        </svg>
      )
    case 'pool':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 14H18C18 15.93 16.5 17.59 14.67 17.93C15.67 18.36 16.67 19.11 17.33 20H22V14ZM2 14H6V20H3.33C4 19.11 5 18.36 6 17.93C4.17 17.59 2.67 15.93 2.67 14H2C2 15.1 2.56 16.11 3.44 16.78C2.89 16.28 2.22 15.97 1.5 15.81V14ZM12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5ZM12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7Z" />
        </svg>
      )
    case 'spa':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      )
    case 'gym':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L7 5.57L5.57 7L12 13.43L14.57 10.86L13.14 9.43L16.57 6L18 7.43L16.57 8.86L13.14 12.43L14.57 13.86L18 10.43L19.43 11.86L18 13.43L19.43 14.86L17.71 16.57L16.29 15.14L17.71 13.71L14.57 10.57L13.14 12L10 8.86L11.43 7.43L10 6L8.57 7.43L10.14 9L11 9.86L8.43 12.43L7 11L5.57 12.43L7 13.86L5.57 15.29L7.29 17L8.71 15.57L7.29 14.14L10.43 11L8.29 8.86L6.86 10.29L8.29 11.71L5.57 14.43L7 15.86L5.57 17.29L7.29 19L8.71 17.57L7.29 16.14L11.14 12.29L10 11.14L13.14 8L14.57 9.43L13.14 10.86L15.86 13.57L14.43 15L16.57 17.14L18 15.71L16.57 14.29L20 10.86L18 8.86L16.57 10.29L18 11.71L15.86 13.86L18 16L16.57 17.43L19.43 20.29L21 18.71L17.29 15L19.43 12.86L18 11.43L19.43 10L20.86 11.43L19.43 12.86L22 15.43L20.57 16.86L22 18.29L23.43 16.86L20.57 14.86Z" />
        </svg>
      )
    case 'restaurant':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M11 9H9V2H7V9H5V2H3V9C3 11.12 4.66 12.84 6.75 12.97V22H9.25V12.97C11.34 12.84 13 11.12 13 9V2H11V9ZM16 6V14H14.5V22H16V14H17.5V22H19V6H16Z" />
        </svg>
      )
    case 'kitchen':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM6 4H11V12L8.5 10.5L6 12V4Z" />
        </svg>
      )
    case 'room':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 14C8.1 14 9 13.1 9 12C9 10.9 8.1 10 7 10C5.9 10 5 10.9 5 12C5 13.1 5.9 14 7 14ZM7 8C9.21 8 11 9.79 11 12C11 14.21 9.21 16 7 16C4.79 16 3 14.21 3 12C3 9.79 4.79 8 7 8ZM19 7H11V15H3V5H1V20H3V17H19V20H21V11C21 8.79 19.21 7 19 7ZM21 15H13V9H19C20.1 9 21 9.9 21 11V15Z" />
        </svg>
      )
    case 'parking':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13 3H6V21H13V3ZM15 5H8V19H15V5ZM19 9H17V13H19V9ZM19 5H14V3H19V5ZM5 3H3V5H5V3ZM5 7H3V9H5V7ZM5 11H3V13H5V11ZM5 15H3V17H5V15ZM5 19H3V21H5V19ZM22 11H20V13H22V11ZM22 15H20V17H22V15ZM19 17H17V19H19V17ZM22 7H20V9H22V7ZM19 11H17V15H19V11Z" />
        </svg>
      )
    case 'route':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2ZM12 15.5L6.46 17.67L12 5.67L17.54 17.67L12 15.5Z" />
        </svg>
      )
  }
}

function MapSVGLabels({ t }: { t: (key: string) => string }) {
  const lbl = (key: string) => t(`map.svgLabels.${key}`)

  return (
    <>
      <rect x="20" y="80" width="360" height="200" fill="#e8f5e9" stroke="#4caf50" strokeWidth="2" rx="4" />
      <text x="200" y="185" fontSize="14" fill="#2e7d32" textAnchor="middle" fontWeight="bold">{lbl('habitaciones')}</text>

      <rect x="400" y="80" width="380" height="200" fill="#fff3e0" stroke="#ff9800" strokeWidth="2" rx="4" />
      <text x="590" y="185" fontSize="14" fill="#e65100" textAnchor="middle" fontWeight="bold">{lbl('servicios')}</text>

      <rect x="420" y="95" width="170" height="85" fill="#ffe0b2" stroke="#f57c00" strokeWidth="1" rx="2" />
      <text x="505" y="120" fontSize="10" fill="#e65100" textAnchor="middle">{lbl('restaurante')}</text>
      <text x="505" y="135" fontSize="7" fill="#e65100" textAnchor="middle">{lbl('mesas')}</text>
      <text x="505" y="150" fontSize="7" fill="#e65100" textAnchor="middle">{lbl('accesibles')}</text>
      <text x="505" y="165" fontSize="7" fill="#e65100" textAnchor="middle">{lbl('menuBraille')}</text>

      <rect x="600" y="95" width="175" height="85" fill="#ffe0b2" stroke="#f57c00" strokeWidth="1" rx="2" />
      <text x="687" y="118" fontSize="10" fill="#e65100" textAnchor="middle">{lbl('salaEventos')}</text>
      <text x="687" y="132" fontSize="7" fill="#e65100" textAnchor="middle">{lbl('rampaEscenario')}</text>
      <text x="687" y="145" fontSize="7" fill="#e65100" textAnchor="middle">{lbl('induccionMagnetica')}</text>
      <text x="687" y="158" fontSize="7" fill="#e65100" textAnchor="middle">{lbl('espaciosSIA')}</text>

      <rect x="420" y="185" width="170" height="85" fill="#ffe0b2" stroke="#f57c00" strokeWidth="1" rx="2" />
      <text x="505" y="210" fontSize="10" fill="#e65100" textAnchor="middle">{lbl('salasJuntas')}</text>
      <text x="505" y="224" fontSize="7" fill="#e65100" textAnchor="middle">{lbl('mesasAccesibles')}</text>
      <text x="505" y="237" fontSize="7" fill="#e65100" textAnchor="middle">{lbl('subtitulosReal')}</text>
      <text x="505" y="250" fontSize="7" fill="#e65100" textAnchor="middle">{lbl('microfonos')}</text>

      <rect x="600" y="185" width="175" height="40" fill="#ffe0b2" stroke="#f57c00" strokeWidth="1" rx="2" />
      <text x="687" y="202" fontSize="9" fill="#e65100" textAnchor="middle">{lbl('lavanderia')}</text>
      <text x="687" y="215" fontSize="7" fill="#e65100" textAnchor="middle">{lbl('altura80')}</text>

      <rect x="600" y="230" width="175" height="40" fill="#ffe0b2" stroke="#f57c00" strokeWidth="1" rx="2" />
      <text x="687" y="247" fontSize="9" fill="#e65100" textAnchor="middle">{lbl('farmacia')}</text>
      <text x="687" y="260" fontSize="7" fill="#e65100" textAnchor="middle">{lbl('blisterBraille')}</text>

      <rect x="100" y="300" width="600" height="160" fill="#f3e5f5" stroke="#9c27b0" strokeWidth="2" rx="4" />
      <text x="400" y="385" fontSize="14" fill="#6a1b9a" textAnchor="middle" fontWeight="bold">{lbl('amenidades')}</text>

      <rect x="20" y="480" width="360" height="100" fill="#e3f2fd" stroke="#2196f3" strokeWidth="2" rx="4" />
      <text x="200" y="535" fontSize="14" fill="#1565c0" textAnchor="middle" fontWeight="bold">{lbl('estacionamiento')}</text>

      <rect x="20" y="300" width="80" height="160" fill="#ffebee" stroke="#f44336" strokeWidth="2" rx="4" />
      <text x="60" y="385" fontSize="10" fill="#c62828" textAnchor="middle" fontWeight="bold">{lbl('salidas')}</text>

      <rect x="400" y="420" width="200" height="140" fill="#e1f5fe" stroke="#03a9f4" strokeWidth="2" rx="4" />
      <text x="500" y="495" fontSize="14" fill="#0277bd" textAnchor="middle" fontWeight="bold">{lbl('lobby')}</text>

      <rect x="40" y="510" width="60" height="40" fill="url(#parking-stripe)" stroke="#2d7a9e" strokeWidth="1" />
      <text x="70" y="535" fontSize="8" fill="#fff" textAnchor="middle">♿</text>

      <rect x="100" y="510" width="60" height="40" fill="url(#parking-stripe)" stroke="#2d7a9e" strokeWidth="1" />
      <text x="130" y="535" fontSize="8" fill="#fff" textAnchor="middle">♿</text>

      <rect x="400" y="440" width="80" height="30" fill="#bbdefb" stroke="#1976d2" strokeWidth="1" />
      <text x="440" y="460" fontSize="9" fill="#0d47a1" textAnchor="middle">{lbl('recepcion')}</text>

      <rect x="520" y="440" width="40" height="50" fill="#bbdefb" stroke="#1976d2" strokeWidth="1" />
      <text x="540" y="470" fontSize="7" fill="#0d47a1" textAnchor="middle">{lbl('ascensor')}</text>

      <rect x="350" y="310" width="100" height="80" fill="#ce93d8" stroke="#7b1fa2" strokeWidth="1" rx="2" />
      <text x="400" y="345" fontSize="10" fill="#4a148c" textAnchor="middle">{lbl('piscina')}</text>
      <line x1="350" y1="370" x2="370" y2="390" stroke="#4a148c" strokeWidth="2" />
      <text x="380" y="385" fontSize="7" fill="#4a148c">{lbl('rampa')}</text>
      <circle cx="420" cy="350" r="8" fill="#7b1fa2" />
      <text x="420" y="354" fontSize="8" fill="#fff" textAnchor="middle">♿</text>

      <rect x="560" y="280" width="80" height="60" fill="#ce93d8" stroke="#7b1fa2" strokeWidth="1" rx="2" />
      <text x="600" y="305" fontSize="9" fill="#4a148c" textAnchor="middle">{lbl('spa')}</text>
      <text x="600" y="320" fontSize="7" fill="#4a148c" textAnchor="middle">{lbl('hidromasaje')}</text>

      <rect x="560" y="350" width="80" height="60" fill="#ce93d8" stroke="#7b1fa2" strokeWidth="1" rx="2" />
      <text x="600" y="380" fontSize="9" fill="#4a148c" textAnchor="middle">{lbl('gimnasio')}</text>

      <rect x="700" y="500" width="75" height="70" fill="#ffe0b2" stroke="#f57c00" strokeWidth="1" rx="2" />
      <text x="737" y="522" fontSize="8" fill="#e65100" textAnchor="middle">{lbl('cocina')}</text>
      <text x="737" y="537" fontSize="7" fill="#e65100" textAnchor="middle">{lbl('banos')}</text>
      <text x="737" y="550" fontSize="6" fill="#e65100" textAnchor="middle">{lbl('pisoAntiderrapante')}</text>

      <rect x="120" y="120" width="60" height="50" fill="#c8e6c9" stroke="#388e3c" strokeWidth="1" rx="2" />
      <text x="150" y="145" fontSize="7" fill="#1b5e20" textAnchor="middle">{lbl('hab3a')}</text>
      <text x="150" y="158" fontSize="6" fill="#1b5e20" textAnchor="middle">♿♿♿♿</text>

      <rect x="120" y="190" width="60" height="50" fill="#c8e6c9" stroke="#388e3c" strokeWidth="1" rx="2" />
      <text x="150" y="215" fontSize="7" fill="#1b5e20" textAnchor="middle">{lbl('hab3b')}</text>
      <text x="150" y="228" fontSize="6" fill="#1b5e20" textAnchor="middle">♿♿♿♿</text>

      <rect x="280" y="120" width="60" height="50" fill="#c8e6c9" stroke="#388e3c" strokeWidth="1" rx="2" />
      <text x="310" y="145" fontSize="7" fill="#1b5e20" textAnchor="middle">{lbl('hab4a')}</text>
      <text x="310" y="158" fontSize="6" fill="#1b5e20" textAnchor="middle">♿♿♿♿</text>

      <rect x="280" y="190" width="60" height="50" fill="#c8e6c9" stroke="#388e3c" strokeWidth="1" rx="2" />
      <text x="310" y="215" fontSize="7" fill="#1b5e20" textAnchor="middle">{lbl('hab4b')}</text>
      <text x="310" y="228" fontSize="6" fill="#1b5e20" textAnchor="middle">♿♿♿♿</text>

      <line x1="60" y1="380" x2="150" y2="380" stroke="#2196f3" strokeWidth="2" strokeDasharray="8,4" />
      <line x1="400" y1="460" x2="400" y2="380" stroke="#2196f3" strokeWidth="2" strokeDasharray="8,4" />
      <line x1="400" y1="380" x2="350" y2="380" stroke="#2196f3" strokeWidth="2" strokeDasharray="8,4" />
      <line x1="220" y1="250" x2="220" y2="380" stroke="#2196f3" strokeWidth="2" strokeDasharray="8,4" />

      <polygon points="55,365 65,365 60,355" fill="#c62828" />
      <text x="60" y="375" fontSize="7" fill="#c62828" textAnchor="middle">{lbl('salida')}</text>
      <line x1="60" y1="380" x2="60" y2="395" stroke="#c62828" strokeWidth="2" />
      <text x="60" y="405" fontSize="6" fill="#c62828" textAnchor="middle">{lbl('rampa')}</text>

      <rect x="400" y="490" width="60" height="60" fill="#bbdefb" stroke="#1976d2" strokeWidth="1" />
      <text x="430" y="525" fontSize="10" fill="#0d47a1" textAnchor="middle">{lbl('entrada')}</text>
      <text x="430" y="540" fontSize="8" fill="#0d47a1" textAnchor="middle">{lbl('principal')}</text>
    </>
  )
}

export function AccessibilityMap() {
  const { t } = useTranslation()
  const mapPoints = useMapPoints(t)
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const selectedPointData = mapPoints.find(p => p.id === selectedPoint)

  const handlePointClick = (pointId: string) => {
    if (selectedPoint === pointId) {
      setSelectedPoint(null)
    } else {
      setSelectedPoint(pointId)
    }
  }

  const categories = [
    { id: 'entrance', label: t('map.categories.entrance'), icon: 'entrance' as const },
    { id: 'vertical', label: t('map.categories.vertical'), icon: 'elevator' as const },
    { id: 'bathroom', label: t('map.categories.bathroom'), icon: 'bathroom' as const },
    { id: 'emergency', label: t('map.categories.emergency'), icon: 'exit' as const },
    { id: 'room', label: t('map.categories.room'), icon: 'room' as const },
    { id: 'recreation', label: t('map.categories.recreation'), icon: 'pool' as const },
    { id: 'route', label: t('map.categories.route'), icon: 'route' as const }
  ]

  const groupedPoints = categories.map(cat => ({
    ...cat,
    points: mapPoints.filter(p => p.category === cat.id)
  }))

  return (
    <div className="map-wrapper">
      <div className="container">
        <div className="map-layout">
          <div className="map-main">
            <div className="map-visual-container">
              <svg
                viewBox="0 0 800 600"
                className="map-svg-detailed"
                aria-label={t('map.svgAriaLabel')}
                role="img"
              >
                <defs>
                  <pattern id="parking-stripe" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="10" stroke="#2d7a9e" strokeWidth="3" />
                  </pattern>
                </defs>

                <MapSVGLabels t={t} />

                {mapPoints.map((point) => {
                  const isSelected = selectedPoint === point.id
                  const isFiltered = activeCategory !== null && point.category !== activeCategory && point.category !== 'route'
                  const pointColor = point.category === 'entrance' ? '#2d7a9e' : point.category === 'emergency' ? '#dc2626' : point.category === 'vertical' ? '#7c3aed' : point.category === 'bathroom' ? '#0891b2' : point.category === 'recreation' ? '#d97706' : point.category === 'room' ? '#059669' : '#2196f3'

                  return (
                    <g
                      key={point.id}
                      transform={`translate(${point.x}, ${point.y})`}
                      className={`map-point ${isSelected ? 'selected' : ''} ${isFiltered ? 'dimmed' : ''}`}
                      onClick={() => handlePointClick(point.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${point.label}: ${point.description}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handlePointClick(point.id)
                        }
                      }}
                    >
                      <circle r="20" fill="transparent" className="map-point-hitarea" />
                      <circle
                        r={isSelected ? 11 : 9}
                        fill={pointColor}
                        opacity={isSelected ? 1 : 0.85}
                        stroke="#fff"
                        strokeWidth="2"
                        className="map-point-visible"
                      />
                      {isSelected && (
                        <circle
                          r="16"
                          fill="none"
                          stroke={pointColor}
                          strokeWidth="3"
                          opacity="0.6"
                          className="map-point-selected-ring"
                        />
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          <div className="map-sidebar">
            <div className="category-filter" role="group" aria-label={t('map.filterAriaLabel')}>
              <button
                className={`category-chip ${activeCategory === null ? 'active' : ''}`}
                onClick={() => setActiveCategory(null)}
                aria-pressed={activeCategory === null}
              >
                {t('map.categories.all')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  aria-pressed={activeCategory === cat.id}
                >
                  <MapIcon type={cat.icon as MapPoint['icon']} />
                  <span className="category-chip-label">{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="legend-list" role="list" aria-label={t('map.pointsAriaLabel')}>
              {groupedPoints.map((group) => {
                const groupPoints = activeCategory === null || activeCategory === group.id
                  ? group.points
                  : []
                if (groupPoints.length === 0) return null

                return (
                  <div key={group.id} className="legend-group">
                    <h4 className="legend-group-title">
                      <MapIcon type={group.icon as MapPoint['icon']} />
                      {group.label}
                    </h4>
                    <ul className="legend-items" role="list">
                      {groupPoints.map((point) => (
                        <li key={point.id}>
                          <button
                            className={`legend-item-btn ${selectedPoint === point.id ? 'selected' : ''}`}
                            onClick={() => handlePointClick(point.id)}
                            aria-pressed={selectedPoint === point.id}
                          >
                            <span className="legend-item-label">{point.label}</span>
                            <svg className="legend-item-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {selectedPointData && (
          <div className="map-detail-card" role="alert" aria-live="polite">
            <div className={`map-detail-icon map-detail-icon--${selectedPointData.category}`}>
              <MapIcon type={selectedPointData.icon} />
            </div>
            <div className="map-detail-content">
              <h3 className="map-detail-title">{selectedPointData.label}</h3>
              <p className="map-detail-description">{selectedPointData.description}</p>
            </div>
            <button
              className="map-detail-close"
              onClick={() => setSelectedPoint(null)}
              aria-label={t('map.closeDetail')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {!selectedPointData && (
          <div className="map-empty-state" role="status">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <p>{t('map.emptyState')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
