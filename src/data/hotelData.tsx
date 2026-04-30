import { type ReactNode } from 'react'

export interface AccessibilityFeatures {
  wheelchairAccessible: boolean
  rollInShower: boolean
  grabBars: boolean
  visualAlarms: boolean
  adjustableFurniture: boolean
  hearingLoop: boolean
  transferCrane: boolean
}

export interface Room {
  name: string
  price: number
  image: string
  features: string[]
  accessibility: AccessibilityFeatures
  altDescription: string
}

export interface Testimonial {
  name: string
  role: string
  text: string
  rating: number
}

export interface AccommodationOption {
  id: string
  label: string
  description: string
}

export interface Facility {
  id: string
  name: string
  icon: ReactNode
  description: string
}

const iconWheelchair = (
  <>
    <span className="sr-only">Icono de accesibilidad en silla de ruedas</span>
    <span aria-hidden="true">&#x267F;</span>
  </>
)

const iconEye = (
  <>
    <span className="sr-only">Icono de asistencia visual</span>
    <span aria-hidden="true">&#x1F441;</span>
  </>
)

const iconEar = (
  <>
    <span className="sr-only">Icono de asistencia auditiva</span>
    <span aria-hidden="true">&#x1F442;</span>
  </>
)

const iconWheelchairAlt = (
  <>
    <span className="sr-only">Icono de movilidad</span>
    <span aria-hidden="true">&#x1F9BD;</span>
  </>
)

const iconSpeaker = (
  <>
    <span className="sr-only">Icono de ambiente sensorialmente amigable</span>
    <span aria-hidden="true">&#x1F50A;</span>
  </>
)

const iconGuide = (
  <>
    <span className="sr-only">Icono de guía personal</span>
    <span aria-hidden="true">&#x1F9CD;&#x200D;&#x1F9AF;</span>
  </>
)

const iconGym = (
  <>
    <span className="sr-only">Icono de gimnasio</span>
    <span aria-hidden="true">&#x1F3CB;&#xFE0F;</span>
  </>
)

const iconPool = (
  <>
    <span className="sr-only">Icono de alberca</span>
    <span aria-hidden="true">&#x1F30A;</span>
  </>
)

const iconBar = (
  <>
    <span className="sr-only">Icono de bar</span>
    <span aria-hidden="true">&#x1F377;</span>
  </>
)

const iconRestaurant = (
  <>
    <span className="sr-only">Icono de restaurante</span>
    <span aria-hidden="true">&#x1F37D;&#xFE0F;</span>
  </>
)

const iconBank = (
  <>
    <span className="sr-only">Icono de convenio con bancos</span>
    <span aria-hidden="true">&#x1F3E6;</span>
  </>
)

const iconShuttle = (
  <>
    <span className="sr-only">Icono de traslados</span>
    <span aria-hidden="true">&#x1F68C;</span>
  </>
)

const iconExchange = (
  <>
    <span className="sr-only">Icono de casa de cambio</span>
    <span aria-hidden="true">&#x1F4B5;</span>
  </>
)

const iconSpa = (
  <>
    <span className="sr-only">Icono de spa</span>
    <span aria-hidden="true">&#x1F9D8;</span>
  </>
)

const iconEvent = (
  <>
    <span className="sr-only">Icono de sala de eventos</span>
    <span aria-hidden="true">&#x1F389;</span>
  </>
)

const iconMeeting = (
  <>
    <span className="sr-only">Icono de salas de juntas</span>
    <span aria-hidden="true">&#x1F4C1;</span>
  </>
)

const iconElevator = (
  <>
    <span className="sr-only">Icono de elevadores</span>
    <span aria-hidden="true">&#x1F6B8;</span>
  </>
)

const iconParking = (
  <>
    <span className="sr-only">Icono de estacionamiento</span>
    <span aria-hidden="true">&#x1F697;</span>
  </>
)

const iconStore = (
  <>
    <span className="sr-only">Icono de Oxxo</span>
    <span aria-hidden="true">&#x1F36A;</span>
  </>
)

const iconLaundry = (
  <>
    <span className="sr-only">Icono de lavanderia</span>
    <span aria-hidden="true">&#x1F6BF;</span>
  </>
)

const iconPharmacy = (
  <>
    <span className="sr-only">Icono de farmacia</span>
    <span aria-hidden="true">&#x1F48A;</span>
  </>
)

export const hotelData = {
  name: "The Grand Executive",
  tagline: "Lujo Ejecutivo e Inclusion Total",
  description: "Hotel cinco estrellas ubicado en el corazon de Paseo de la Reforma. Disenado para ofrecer una experiencia inclusiva excepcional donde cada huesped, sin importar su capacidad, disfruta de absoluta comodidad y autonomia.",
  category: "5 Estrellas",
  hotelType: "Ejecutivo de Alta Gama",
  plan: "Todo Incluido",
  roomsCount: 100,
  location: "Paseo de la Reforma, Ciudad de Mexico",
  phone: "+52 55 9171 0000",
  email: "reservas@thegrandexecutive.mx",
  address: "Paseo de la Reforma 222, Col. Juarez, CDMX, Mexico",
  currency: "MXN",
  amenities: [
    {
      icon: iconWheelchair,
      title: "Habitaciones Accesibles",
      description: "Habitaciones amplias con barras de apoyo, duchas adaptadas y espacio para silla de ruedas."
    },
    {
      icon: iconEye,
      title: "Asistencia Visual",
      description: "Senalamientos en Braille, audiodescripcion y equipamiento para personas con baja vision."
    },
    {
      icon: iconEar,
      title: "Asistencia Auditiva",
      description: "Alarmas visuales, telefonos con amplificador y bucles magneticos en areas comunes."
    },
    {
      icon: iconWheelchairAlt,
      title: "Movilidad",
      description: "Sillas de ruedas disponibles, rampas en todas las areas y ascensores espaciosos."
    },
    {
      icon: iconSpeaker,
      title: "Sensory-Friendly",
      description: "Habitaciones con aislamiento acustico, iluminacion ajustable y zonas de baja estimulacion."
    },
    {
      icon: iconGuide,
      title: "Guia Personal",
      description: "Asistencia personalizada para huespedes con discapacidades visuales o cognitivas."
    }
  ],
  facilities: [
    {
      id: 'gym',
      name: 'Gimnasio',
      icon: iconGym,
      description: 'Equipamiento adapted con maquinas de ejercicio de baja carga, pesas virtuales y entrenamiento-guided por audio. Acceso sin escalones desde el lobby.'
    },
    {
      id: 'pool',
      name: 'Alberca',
      icon: iconPool,
      description: 'Rampa de acceso sumergida, silla de transferencia hydraulic para alberca, vestidores adaptados con barras de apoyo y ducha de emergencia.'
    },
    {
      id: 'bar',
      name: 'Bar',
      icon: iconBar,
      description: 'Mostrador a 75cm de altura con espacio inferior para silla de ruedas. Menu en Braille y carta con letras grandes de 24pt disponibles.'
    },
    {
      id: 'restaurant',
      name: 'Restaurante',
      icon: iconRestaurant,
      description: 'Mesas con espacio inferior libre para silla de ruedas, menu en Braille,土地上-indicadores tactiles en el piso y personal capacitado en protocolo de accesibilidad.'
    },
    {
      id: 'bank',
      name: 'Convenio con bancos',
      icon: iconBank,
      description: 'Cajero automatico con pantalla tactil, salida de audio para transacciones, boton de emergencia en Braille y espacio para silla de ruedas.'
    },
    {
      id: 'shuttle',
      name: 'Traslados',
      icon: iconShuttle,
      description: 'Vehiculos adaptados con rampa de acceso manuelle, anclajes para silla de ruedas y espacio para equipaje de asistencia. Servicio 24 horas.'
    },
    {
      id: 'exchange',
      name: 'Casa de cambio',
      icon: iconExchange,
      description: 'Atencion preferencial en mostrador a 80cm de altura con espacio inferior. Cambio de moneda extranjera y viaj主题eros sin comision.'
    },
    {
      id: 'spa',
      name: 'Spa',
      icon: iconSpa,
      description: 'Zona de tratamiento con camillas electricas ajustables en altura,泡泡-tina de hidromasaje con rampa, y terapeutas capacitados en asistencia a personas con discapacidad.'
    },
    {
      id: 'events',
      name: 'Sala de eventos',
      icon: iconEvent,
      description: 'Escenario con rampa de acceso, iluminacion LED regulable, sistema de audio con induccion magnetica y espacios para silla de ruedas frente al escenario.'
    },
    {
      id: 'meeting',
      name: 'Salas de juntas',
      icon: iconMeeting,
      description: 'Mesas redondas accesibles con espacio central para silla, pantalla gigante con subtitulos en tiempo real y sistema de microphones inalambricos.'
    },
    {
      id: 'elevator',
      name: 'Elevadores',
      icon: iconElevator,
      description: 'Tres elevadores con botones en Braille, audio de planta, espejos panoramicos y capacidad para 15 personas o 2 sillas de ruedas simultaneamente.'
    },
    {
      id: 'parking',
      name: 'Estacionamiento',
      icon: iconParking,
      description: '10 cajones de estacionamiento accesibles cerca de la entrada, con zona de transferencia de 1.50m, senalamientos verticales y rampa hacia el lobby.'
    },
    {
      id: 'store',
      name: 'Tienda',
      icon: iconStore,
      description: 'Pasillo amplio de 1.50m sin obstaculos, estantes a maxima altura de 1.20m, cajas con espacio inferior y entrada sin escalon con puerta automatica.'
    },
    {
      id: 'laundry',
      name: 'Lavanderia',
      icon: iconLaundry,
      description: 'Lavadoras y secadoras a 80cm de altura, puertas anchas de 90cm, servicio de recogida y entrega directa a la habitacion sin costo adicional.'
    },
    {
      id: 'pharmacy',
      name: 'Farmacia',
      icon: iconPharmacy,
      description: 'Atencion a domicilio dentro del hotel, mostrador accesible en el lobby, medications organizados en blisters Braille y servicio de recordatorio de dosis.'
    }
  ],
  rooms: [
    {
      name: "Suite Presidencial Accesible",
      price: 4500,
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600",
      features: [
        "Acceso total silla de ruedas",
        "Ducha a ras de suelo",
        "Barras de apoyo en baño",
        "Alarmas visuales y vibratorias",
        "Mobiliario de altura ajustable",
        "Bucle magnetico integrado",
        "Grua de transferencia disponible",
        "Smart TV con subtitulos y SDL"
      ],
      accessibility: {
        wheelchairAccessible: true,
        rollInShower: true,
        grabBars: true,
        visualAlarms: true,
        adjustableFurniture: true,
        hearingLoop: true,
        transferCrane: true
      },
      altDescription: "Suite espaciosa con cama king size, espacio de giro amplio para silla de ruedas, baño privado con ducha a ras de suelo, barras de apoyo cromadas, mobiliario de altura ajustable, y sistema de alerta visual. Vista panoramica de Paseo de la Reforma."
    },
    {
      name: "Suite Junior Accesible",
      price: 3200,
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
      features: [
        "Acceso para silla de ruedas",
        "Ducha sin bordillo",
        "Barras de apoyo",
        "Alarmas visuales",
        "Mobiliario ajustable",
        "Bucle magnetico en area comun"
      ],
      accessibility: {
        wheelchairAccessible: true,
        rollInShower: true,
        grabBars: true,
        visualAlarms: true,
        adjustableFurniture: true,
        hearingLoop: true,
        transferCrane: false
      },
      altDescription: "Suite elegante con cama queen size, baño adaptado con ducha sin bordillo y barras de apoyo, escritorio de altura regulable, y alarma visual junto a la cama. Vista al centro comercial."
    },
    {
      name: "Habitacion Estandar Adaptada",
      price: 2800,
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600",
      features: [
        "Barras de apoyo en baño",
        "Alarmas visuales junto a la cama",
        "Bucle magnetico portatil",
        "Escritorio accesible",
        "Puertas anchas"
      ],
      accessibility: {
        wheelchairAccessible: false,
        rollInShower: false,
        grabBars: true,
        visualAlarms: true,
        adjustableFurniture: true,
        hearingLoop: true,
        transferCrane: false
      },
      altDescription: "Habitacion doble con baño adaptado que incluye barras de apoyo junto al inodoro y en la regadera, alarma visual en la mesita de noche, bucle magnetico portatil disponible bajo request, y puertas de ancho completo para acceso comodo."
    }
  ],
  testimonials: [
    {
      name: "Maria Garcia",
      role: "Huesped con discapacidad motora",
      text: "Por primera vez en mi vida, me senti realmente libre en un hotel. Todo estaba adaptado perfectamente, desde la ducha hasta el escritorio.",
      rating: 5
    },
    {
      name: "Carlos Mendoza",
      role: "Huesped con discapacidad visual",
      text: "El personal me asistio con una dedicacion increible. Pude moverme con total autonomia gracias al sistema Braille y la audiodescripcion.",
      rating: 5
    },
    {
      name: "Ana Ruiz",
      role: "Madre de hijo con TEA",
      text: "La habitacion de baja estimulacion fue un oasis para mi hijo. Pudimos disfrutar de nuestras vacaciones sin estres ni abrumacion sensorial.",
      rating: 5
    }
  ]
}

export const accommodationOptions = [
  {
    id: 'auditory-kit',
    label: 'Kit de accesibilidad auditiva',
    description: 'Timbre visual, despertador vibratorio y bucle magnetico portatil'
  },
  {
    id: 'guide-dog',
    label: 'Alojamiento para perro guia',
    description: 'Cama, comederos y zona designada para perro de asistencia'
  },
  {
    id: 'transfer-crane',
    label: 'Grua de transferencia',
    description: 'Sistema de techo para movilidad entre cama y silla de ruedas'
  },
  {
    id: 'braille-menu',
    label: 'Menu y documentacion en Braille',
    description: 'Menu del restaurante, directorio del hotel y senalamientos'
  },
  {
    id: 'special-diet',
    label: 'Dieta especial',
    description: 'Alergias alimentarias, restricciones o necesidades dieteticas especificas'
  },
  {
    id: 'visual-assistance',
    label: 'Asistencia visual personalizada',
    description: 'Acompanamiento guiado en instalaciones del hotel'
  },
  {
    id: 'wheelchair',
    label: 'Silla de ruedas de cortesia',
    description: 'Silla de ruedas manual o motorizada durante la estancia'
  },
  {
    id: 'hospital-bed',
    label: 'Cama hospitalaria o antireflujos',
    description: 'Cama articulada con barandales y control remoto'
  }
]

export const accessibilityFilterOptions = [
  { id: 'wheelchairAccessible', label: 'Espacio para silla de ruedas' },
  { id: 'rollInShower', label: 'Ducha a ras de suelo' },
  { id: 'grabBars', label: 'Barras de apoyo' },
  { id: 'visualAlarms', label: 'Alarmas visuales' },
  { id: 'adjustableFurniture', label: 'Mobiliario ajustable' },
  { id: 'hearingLoop', label: 'Bucle magnetico' },
  { id: 'transferCrane', label: 'Grua de transferencia' }
]
