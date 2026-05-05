import 'regenerator-runtime/runtime'
import { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { toast } from 'react-hot-toast'
import './VoiceNavigator.css'

export function VoiceNavigator() {
  const [isVoiceActive, setIsVoiceActive] = useState(false)

  const commands = [
    {
      command: ['*inicio*', '*arriba del todo*'],
      callback: () => {
        document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' })
        toast('Navegando al Inicio', { icon: '🏠' })
      }
    },
    {
      command: '*instalaciones*',
      callback: () => {
        document.getElementById('instalaciones')?.scrollIntoView({ behavior: 'smooth' })
        toast('Navegando a Instalaciones', { icon: '🏢' })
      }
    },
    {
      command: '*habitaciones*',
      callback: () => {
        document.getElementById('habitaciones')?.scrollIntoView({ behavior: 'smooth' })
        toast('Navegando a Habitaciones', { icon: '🛏️' })
      }
    },
    {
      command: '*mapa*',
      callback: () => {
        document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth' })
        toast('Navegando al Mapa', { icon: '🗺️' })
      }
    },
    {
      command: ['*contacto*', '*reservar*'],
      callback: () => {
        document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
        toast('Navegando a Contacto', { icon: '📅' })
        setTimeout(() => document.getElementById('contact-name')?.focus(), 1000)
      }
    },
    {
      command: ['*consultar*', '*mi reserva*', '*mi pedido*'],
      callback: () => {
        document.getElementById('consultar-reserva')?.scrollIntoView({ behavior: 'smooth' })
        toast('Consultar Reserva', { icon: '🔍' })
      }
    },
    {
      command: ['*bajar*', '*abajo*'],
      callback: () => {
        window.scrollBy({ top: 600, behavior: 'smooth' })
        toast('Bajando pantalla', { icon: '⬇️' })
      }
    },
    {
      command: ['*subir*', '*arriba*'],
      callback: () => {
        window.scrollBy({ top: -600, behavior: 'smooth' })
        toast('Subiendo pantalla', { icon: '⬆️' })
      }
    },
    {
      command: ['*detener voz*', '*apagar micrófono*'],
      callback: () => {
        toggleVoice(false)
        toast('Control por voz desactivado', { icon: '🔇' })
      }
    }
  ]

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition({ commands })

  const toggleVoice = (activate: boolean) => {
    if (activate) {
      if (!isMicrophoneAvailable) {
        toast.error('El micrófono no está disponible o no tiene permisos.')
        return
      }
      SpeechRecognition.startListening({ continuous: true, language: 'es-MX' })
      setIsVoiceActive(true)
      toast.success('Control por voz activado. Diga "Ir a habitaciones", "Reservar", etc.')
    } else {
      SpeechRecognition.stopListening()
      setIsVoiceActive(false)
    }
  }

  useEffect(() => {
    // Si el usuario deja de hablar, limpiamos el transcript después de 3 segundos para no saturar la pantalla
    const timeout = setTimeout(() => {
      if (transcript) resetTranscript()
    }, 3000)
    return () => clearTimeout(timeout)
  }, [transcript, resetTranscript])

  if (!browserSupportsSpeechRecognition) {
    return null // Si el navegador (ej: Safari antiguo) no lo soporta, simplemente no mostramos el botón
  }

  return (
    <div className="voice-navigator">
      <button 
        className={`voice-btn ${listening ? 'listening' : ''}`}
        onClick={() => toggleVoice(!isVoiceActive)}
        aria-label={listening ? 'Desactivar control por voz' : 'Activar control por voz'}
        aria-pressed={listening}
      >
        <span className="voice-icon" aria-hidden="true">
          {listening ? '🎙️' : '🎤'}
        </span>
        <span className="voice-text">
          {listening ? 'Escuchando...' : 'Control por Voz'}
        </span>
      </button>

      {listening && transcript && (
        <div className="voice-transcript" aria-live="polite">
          "{transcript}"
        </div>
      )}
    </div>
  )
}
