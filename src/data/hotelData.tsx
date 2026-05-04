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
    <span className="sr-only">Icono de tienda</span>
    <span aria-hidden="true">&#x1F36A;</span>
  </>
)

const iconLaundry = (
  <>
    <span className="sr-only">Icono de lavandería</span>
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
  tagline: "Lujo Ejecutivo e Inclusión Total",
  description: "Hotel cinco estrellas ubicado en el corazón de Paseo de la Reforma. Diseñado para ofrecer una experiencia inclusiva excepcional donde cada huésped, sin importar su capacidad, disfruta de absoluta comodidad y autonomía.",
  category: "5 Estrellas",
  hotelType: "Ejecutivo de Alta Gama",
  plan: "Todo Incluido",
  roomsCount: 100,
  location: "Paseo de la Reforma, Ciudad de México",
  phone: "+52 55 9171 0000",
  email: "reservas@thegrandexecutive.mx",
  address: "Paseo de la Reforma 222, Col. Juárez, CDMX, México",
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
      description: "Señalamientos en Braille, audiodescripción y equipamiento para personas con baja visión."
    },
    {
      icon: iconEar,
      title: "Asistencia Auditiva",
      description: "Alarmas visuales, teléfonos con amplificador y bucles magnéticos en áreas comunes."
    },
    {
      icon: iconWheelchairAlt,
      title: "Movilidad",
      description: "Sillas de ruedas disponibles, rampas en todas las áreas y ascensores espaciosos."
    },
    {
      icon: iconSpeaker,
      title: "Sensory-Friendly",
      description: "Habitaciones con aislamiento acústico, iluminación ajustable y zonas de baja estimulación."
    },
    {
      icon: iconGuide,
      title: "Guía Personal",
      description: "Asistencia personalizada para huéspedes con discapacidades visuales o cognitivas."
    }
  ],
  facilities: [
    {
      id: 'gym',
      name: 'Gimnasio',
      icon: iconGym,
      description: 'Equipamiento adaptado con máquinas de ejercicio de baja carga, pesas virtuales y entrenamiento guiado por audio. Acceso sin escalones desde el lobby.'
    },
    {
      id: 'pool',
      name: 'Alberca',
      icon: iconPool,
      description: 'Rampa de acceso sumergida, silla de transferencia hidráulica para alberca, vestidores adaptados con barras de apoyo y ducha de emergencia.'
    },
    {
      id: 'bar',
      name: 'Bar',
      icon: iconBar,
      description: 'Mostrador a 75cm de altura con espacio inferior para silla de ruedas. Menú en Braille y carta con letras grandes de 24pt disponibles.'
    },
    {
      id: 'restaurant',
      name: 'Restaurante',
      icon: iconRestaurant,
      description: 'Mesas con espacio inferior libre para silla de ruedas, menú en Braille, indicadores táctiles en el piso y personal capacitado en protocolo de accesibilidad.'
    },
    {
      id: 'bank',
      name: 'Convenio con bancos',
      icon: iconBank,
      description: 'Cajero automático con pantalla táctil, salida de audio para transacciones, botón de emergencia en Braille y espacio para silla de ruedas.'
    },
    {
      id: 'shuttle',
      name: 'Traslados',
      icon: iconShuttle,
      description: 'Vehículos adaptados con rampa de acceso manual, anclajes para silla de ruedas y espacio para equipaje de asistencia. Servicio 24 horas.'
    },
    {
      id: 'exchange',
      name: 'Casa de cambio',
      icon: iconExchange,
      description: 'Atención preferencial en mostrador a 80cm de altura con espacio inferior. Cambio de moneda extranjera y para viajeros sin comisión.'
    },
    {
      id: 'spa',
      name: 'Spa',
      icon: iconSpa,
      description: 'Zona de tratamiento con camillas eléctricas ajustables en altura, tina de hidromasaje con rampa, y terapeutas capacitados en asistencia a personas con discapacidad.'
    },
    {
      id: 'events',
      name: 'Sala de eventos',
      icon: iconEvent,
      description: 'Escenario con rampa de acceso, iluminación LED regulable, sistema de audio con inducción magnética y espacios para silla de ruedas frente al escenario.'
    },
    {
      id: 'meeting',
      name: 'Salas de juntas',
      icon: iconMeeting,
      description: 'Mesas redondas accesibles con espacio central para silla, pantalla gigante con subtítulos en tiempo real y sistema de micrófonos inalámbricos.'
    },
    {
      id: 'elevator',
      name: 'Elevadores',
      icon: iconElevator,
      description: 'Tres elevadores con botones en Braille, audio de planta, espejos panorámicos y capacidad para 15 personas o 2 sillas de ruedas simultáneamente.'
    },
    {
      id: 'parking',
      name: 'Estacionamiento',
      icon: iconParking,
      description: '10 cajones de estacionamiento accesibles cerca de la entrada, con zona de transferencia de 1.50m, señalamientos verticales y rampa hacia el lobby.'
    },
    {
      id: 'store',
      name: 'Tienda',
      icon: iconStore,
      description: 'Pasillo amplio de 1.50m sin obstáculos, estantes a máxima altura de 1.20m, cajas con espacio inferior y entrada sin escalón con puerta automática.'
    },
    {
      id: 'laundry',
      name: 'Lavandería',
      icon: iconLaundry,
      description: 'Lavadoras y secadoras a 80cm de altura, puertas anchas de 90cm, servicio de recogida y entrega directa a la habitación sin costo adicional.'
    },
    {
      id: 'pharmacy',
      name: 'Farmacia',
      icon: iconPharmacy,
      description: 'Atención a domicilio dentro del hotel, mostrador accesible en el lobby, medicamentos organizados en blisters Braille y servicio de recordatorio de dosis.'
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
        "Bucle magnético integrado",
        "Grúa de transferencia disponible",
        "Smart TV con subtítulos y SDL"
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
      altDescription: "Suite espaciosa con cama king size, espacio de giro amplio para silla de ruedas, baño privado con ducha a ras de suelo, barras de apoyo cromadas, mobiliario de altura ajustable, y sistema de alerta visual. Vista panorámica de Paseo de la Reforma."
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
        "Bucle magnético en área común"
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
      name: "Habitación Estándar Adaptada",
      price: 2800,
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600",
      features: [
        "Barras de apoyo en baño",
        "Alarmas visuales junto a la cama",
        "Bucle magnético portátil",
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
      altDescription: "Habitación doble con baño adaptado que incluye barras de apoyo junto al inodoro y en la regadera, alarma visual en la mesita de noche, bucle magnético portátil disponible bajo petición, y puertas de ancho completo para acceso cómodo."
    }
  ],
  testimonials: [
    {
      name: "María García",
      role: "Huésped con discapacidad motora",
      text: "Por primera vez en mi vida, me sentí realmente libre en un hotel. Todo estaba adaptado perfectamente, desde la ducha hasta el escritorio.",
      rating: 5
    },
    {
      name: "Carlos Mendoza",
      role: "Huésped con discapacidad visual",
      text: "El personal me asistió con una dedicación increíble. Pude moverme con total autonomía gracias al sistema Braille y la audiodescripción.",
      rating: 5
    },
    {
      name: "Ana Ruiz",
      role: "Madre de hijo con TEA",
      text: "La habitación de baja estimulación fue un oasis para mi hijo. Pudimos disfrutar de nuestras vacaciones sin estrés ni abrumación sensorial.",
      rating: 5
    }
  ]
}

export const accommodationOptions = [
  {
    id: 'auditory-kit',
    label: 'Kit de accesibilidad auditiva',
    description: 'Timbre visual, despertador vibratorio y bucle magnético portátil'
  },
  {
    id: 'guide-dog',
    label: 'Alojamiento para perro guía',
    description: 'Cama, comederos y zona designada para perro de asistencia'
  },
  {
    id: 'transfer-crane',
    label: 'Grúa de transferencia',
    description: 'Sistema de techo para movilidad entre cama y silla de ruedas'
  },
  {
    id: 'braille-menu',
    label: 'Menú y documentación en Braille',
    description: 'Menú del restaurante, directorio del hotel y señalamientos'
  },
  {
    id: 'special-diet',
    label: 'Dieta especial',
    description: 'Alergias alimentarias, restricciones o necesidades dietéticas específicas'
  },
  {
    id: 'visual-assistance',
    label: 'Asistencia visual personalizada',
    description: 'Acompañamiento guiado en instalaciones del hotel'
  },
  {
    id: 'wheelchair',
    label: 'Silla de ruedas de cortesía',
    description: 'Silla de ruedas manual o motorizada durante la estancia'
  },
  {
    id: 'hospital-bed',
    label: 'Cama hospitalaria o antirreflujo',
    description: 'Cama articulada con barandales y control remoto'
  }
]

export const accessibilityFilterOptions = [
  { id: 'wheelchairAccessible', label: 'Espacio para silla de ruedas' },
  { id: 'rollInShower', label: 'Ducha a ras de suelo' },
  { id: 'grabBars', label: 'Barras de apoyo' },
  { id: 'visualAlarms', label: 'Alarmas visuales' },
  { id: 'adjustableFurniture', label: 'Mobiliario ajustable' },
  { id: 'hearingLoop', label: 'Bucle magnético' },
  { id: 'transferCrane', label: 'Grúa de transferencia' }
]