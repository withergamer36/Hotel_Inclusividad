import { useTranslation } from 'react-i18next'
import { type ReactNode } from 'react'
import type {
  AccessibilityFeatures,
  Room,
  Testimonial,
  AccommodationOption,
  Facility
} from '../data/hotelData'

export type { AccessibilityFeatures, Room, Testimonial, AccommodationOption, Facility }

function makeIcon(srLabel: string, symbol: string): ReactNode {
  return (
    <>
      <span className="sr-only">{srLabel}</span>
      <span aria-hidden="true">{symbol}</span>
    </>
  )
}

export function useHotelData() {
  const { t } = useTranslation()

  const il = (key: string) => t(`hotel.iconLabels.${key}`)

  const iconWheelchair = makeIcon(il('wheelchair'), '\u267F')
  const iconEye = makeIcon(il('visual'), '\u{1F441}')
  const iconEar = makeIcon(il('auditory'), '\u{1F442}')
  const iconWheelchairAlt = makeIcon(il('mobility'), '\u{1F9BD}')
  const iconSpeaker = makeIcon(il('sensory'), '\u{1F50A}')
  const iconGuide = makeIcon(il('guide'), '\u{1F9CD}\u200D\u{1F9AF}')
  const iconGym = makeIcon(il('gym'), '\u{1F3CB}\uFE0F')
  const iconPool = makeIcon(il('pool'), '\u{1F30A}')
  const iconBar = makeIcon(il('bar'), '\u{1F377}')
  const iconRestaurant = makeIcon(il('restaurant'), '\u{1F37D}\uFE0F')
  const iconBank = makeIcon(il('bank'), '\u{1F3E6}')
  const iconShuttle = makeIcon(il('shuttle'), '\u{1F68C}')
  const iconExchange = makeIcon(il('exchange'), '\u{1F4B5}')
  const iconSpa = makeIcon(il('spa'), '\u{1F9D8}')
  const iconEvent = makeIcon(il('events'), '\u{1F389}')
  const iconMeeting = makeIcon(il('meeting'), '\u{1F4C1}')
  const iconElevator = makeIcon(il('elevator'), '\u{1F6B8}')
  const iconParking = makeIcon(il('parking'), '\u{1F697}')
  const iconStore = makeIcon(il('store'), '\u{1F36A}')
  const iconLaundry = makeIcon(il('laundry'), '\u{1F6BF}')
  const iconPharmacy = makeIcon(il('pharmacy'), '\u{1F48A}')

  const hotelData = {
    name: t('hotel.name'),
    tagline: t('hotel.tagline'),
    description: t('hotel.description'),
    category: t('hotel.category'),
    hotelType: t('hotel.hotelType'),
    plan: t('hotel.plan'),
    roomsCount: 100,
    location: t('hotel.location'),
    phone: '+52 55 9171 0000',
    email: 'reservas@thegrandexecutive.mx',
    address: t('hotel.address'),
    currency: 'MXN',
    heroImageAlt: t('hotel.heroImageAlt'),

    amenities: [
      {
        icon: iconWheelchair,
        title: t('hotel.amenities.wheelchair.title'),
        description: t('hotel.amenities.wheelchair.description')
      },
      {
        icon: iconEye,
        title: t('hotel.amenities.visual.title'),
        description: t('hotel.amenities.visual.description')
      },
      {
        icon: iconEar,
        title: t('hotel.amenities.auditory.title'),
        description: t('hotel.amenities.auditory.description')
      },
      {
        icon: iconWheelchairAlt,
        title: t('hotel.amenities.mobility.title'),
        description: t('hotel.amenities.mobility.description')
      },
      {
        icon: iconSpeaker,
        title: t('hotel.amenities.sensory.title'),
        description: t('hotel.amenities.sensory.description')
      },
      {
        icon: iconGuide,
        title: t('hotel.amenities.guide.title'),
        description: t('hotel.amenities.guide.description')
      }
    ],

    facilities: [
      { id: 'gym', name: t('hotel.facilities.gym.name'), icon: iconGym, description: t('hotel.facilities.gym.description') },
      { id: 'pool', name: t('hotel.facilities.pool.name'), icon: iconPool, description: t('hotel.facilities.pool.description') },
      { id: 'bar', name: t('hotel.facilities.bar.name'), icon: iconBar, description: t('hotel.facilities.bar.description') },
      { id: 'restaurant', name: t('hotel.facilities.restaurant.name'), icon: iconRestaurant, description: t('hotel.facilities.restaurant.description') },
      { id: 'bank', name: t('hotel.facilities.bank.name'), icon: iconBank, description: t('hotel.facilities.bank.description') },
      { id: 'shuttle', name: t('hotel.facilities.shuttle.name'), icon: iconShuttle, description: t('hotel.facilities.shuttle.description') },
      { id: 'exchange', name: t('hotel.facilities.exchange.name'), icon: iconExchange, description: t('hotel.facilities.exchange.description') },
      { id: 'spa', name: t('hotel.facilities.spa.name'), icon: iconSpa, description: t('hotel.facilities.spa.description') },
      { id: 'events', name: t('hotel.facilities.events.name'), icon: iconEvent, description: t('hotel.facilities.events.description') },
      { id: 'meeting', name: t('hotel.facilities.meeting.name'), icon: iconMeeting, description: t('hotel.facilities.meeting.description') },
      { id: 'elevator', name: t('hotel.facilities.elevator.name'), icon: iconElevator, description: t('hotel.facilities.elevator.description') },
      { id: 'parking', name: t('hotel.facilities.parking.name'), icon: iconParking, description: t('hotel.facilities.parking.description') },
      { id: 'store', name: t('hotel.facilities.store.name'), icon: iconStore, description: t('hotel.facilities.store.description') },
      { id: 'laundry', name: t('hotel.facilities.laundry.name'), icon: iconLaundry, description: t('hotel.facilities.laundry.description') },
      { id: 'pharmacy', name: t('hotel.facilities.pharmacy.name'), icon: iconPharmacy, description: t('hotel.facilities.pharmacy.description') }
    ] as Facility[],

    rooms: [
      {
        name: t('hotel.rooms.suitePresidencial.name'),
        price: 4500,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
        features: (t('hotel.rooms.suitePresidencial.features', { returnObjects: true }) as string[]),
        accessibility: {
          wheelchairAccessible: true,
          rollInShower: true,
          grabBars: true,
          visualAlarms: true,
          adjustableFurniture: true,
          hearingLoop: true,
          transferCrane: true
        } as AccessibilityFeatures,
        altDescription: t('hotel.rooms.suitePresidencial.altDescription')
      } as Room,
      {
        name: t('hotel.rooms.suiteJunior.name'),
        price: 3200,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600',
        features: (t('hotel.rooms.suiteJunior.features', { returnObjects: true }) as string[]),
        accessibility: {
          wheelchairAccessible: true,
          rollInShower: true,
          grabBars: true,
          visualAlarms: true,
          adjustableFurniture: true,
          hearingLoop: true,
          transferCrane: false
        } as AccessibilityFeatures,
        altDescription: t('hotel.rooms.suiteJunior.altDescription')
      } as Room,
      {
        name: t('hotel.rooms.habitacionEstandar.name'),
        price: 2800,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600',
        features: (t('hotel.rooms.habitacionEstandar.features', { returnObjects: true }) as string[]),
        accessibility: {
          wheelchairAccessible: false,
          rollInShower: false,
          grabBars: true,
          visualAlarms: true,
          adjustableFurniture: true,
          hearingLoop: true,
          transferCrane: false
        } as AccessibilityFeatures,
        altDescription: t('hotel.rooms.habitacionEstandar.altDescription')
      } as Room
    ],

    testimonials: [
      {
        name: t('hotel.testimonials.maria.name'),
        role: t('hotel.testimonials.maria.role'),
        text: t('hotel.testimonials.maria.text'),
        rating: 5
      } as Testimonial,
      {
        name: t('hotel.testimonials.carlos.name'),
        role: t('hotel.testimonials.carlos.role'),
        text: t('hotel.testimonials.carlos.text'),
        rating: 5
      } as Testimonial,
      {
        name: t('hotel.testimonials.ana.name'),
        role: t('hotel.testimonials.ana.role'),
        text: t('hotel.testimonials.ana.text'),
        rating: 5
      } as Testimonial
    ]
  }

  const accommodationOptions: AccommodationOption[] = [
    {
      id: 'auditory-kit',
      label: t('hotel.accommodationOptions.auditory-kit.label'),
      description: t('hotel.accommodationOptions.auditory-kit.description')
    },
    {
      id: 'guide-dog',
      label: t('hotel.accommodationOptions.guide-dog.label'),
      description: t('hotel.accommodationOptions.guide-dog.description')
    },
    {
      id: 'transfer-crane',
      label: t('hotel.accommodationOptions.transfer-crane.label'),
      description: t('hotel.accommodationOptions.transfer-crane.description')
    },
    {
      id: 'braille-menu',
      label: t('hotel.accommodationOptions.braille-menu.label'),
      description: t('hotel.accommodationOptions.braille-menu.description')
    },
    {
      id: 'special-diet',
      label: t('hotel.accommodationOptions.special-diet.label'),
      description: t('hotel.accommodationOptions.special-diet.description')
    },
    {
      id: 'visual-assistance',
      label: t('hotel.accommodationOptions.visual-assistance.label'),
      description: t('hotel.accommodationOptions.visual-assistance.description')
    },
    {
      id: 'wheelchair',
      label: t('hotel.accommodationOptions.wheelchair.label'),
      description: t('hotel.accommodationOptions.wheelchair.description')
    },
    {
      id: 'hospital-bed',
      label: t('hotel.accommodationOptions.hospital-bed.label'),
      description: t('hotel.accommodationOptions.hospital-bed.description')
    }
  ]

  const accessibilityFilterOptions = [
    { id: 'wheelchairAccessible', label: t('hotel.filterOptions.wheelchairAccessible') },
    { id: 'rollInShower', label: t('hotel.filterOptions.rollInShower') },
    { id: 'grabBars', label: t('hotel.filterOptions.grabBars') },
    { id: 'visualAlarms', label: t('hotel.filterOptions.visualAlarms') },
    { id: 'adjustableFurniture', label: t('hotel.filterOptions.adjustableFurniture') },
    { id: 'hearingLoop', label: t('hotel.filterOptions.hearingLoop') },
    { id: 'transferCrane', label: t('hotel.filterOptions.transferCrane') }
  ]

  return { hotelData, accommodationOptions, accessibilityFilterOptions }
}
