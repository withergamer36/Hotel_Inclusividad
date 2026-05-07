import 'regenerator-runtime/runtime'
import { useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { toast } from 'react-hot-toast'
import './VoiceNavigator.css'

export function VoiceNavigator({ currentView }: { currentView?: string }) {
  const { t, i18n } = useTranslation()

  const commands = useMemo(() => {
    const isLanding = !currentView || currentView === 'landing'
    const stopCmd = {
      command: ['*detener voz*', '*apagar micrófono*', '*stop voice*', '*turn off mic*'],
      callback: () => {
        SpeechRecognition.stopListening()
        toast(t('voice.deactivated'), { icon: '\u{1F507}' })
      }
    }

    if (!isLanding) return [stopCmd]

    return [
      {
        command: ['*inicio*', '*arriba del todo*', '*home*', '*top*'],
        callback: () => {
          document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' })
          toast(t('voice.navigatingInicio'), { icon: '\u{1F3E0}' })
        }
      },
      {
        command: ['*instalaciones*', '*facilities*'],
        callback: () => {
          document.getElementById('instalaciones')?.scrollIntoView({ behavior: 'smooth' })
          toast(t('voice.navigatingInstalaciones'), { icon: '\u{1F3E2}' })
        }
      },
      {
        command: ['*habitaciones*', '*rooms*'],
        callback: () => {
          document.getElementById('habitaciones')?.scrollIntoView({ behavior: 'smooth' })
          toast(t('voice.navigatingHabitaciones'), { icon: '\u{1F6CF}\uFE0F' })
        }
      },
      {
        command: ['*mapa*', '*map*'],
        callback: () => {
          document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth' })
          toast(t('voice.navigatingMapa'), { icon: '\u{1F5FA}\uFE0F' })
        }
      },
      {
        command: ['*contacto*', '*reservar*', '*contact*', '*book*'],
        callback: () => {
          document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
          toast(t('voice.navigatingContacto'), { icon: '\u{1F4C5}' })
          setTimeout(() => document.getElementById('contact-name')?.focus(), 1000)
        }
      },
      {
        command: ['*consultar*', '*mi reserva*', '*mi pedido*', '*check*', '*my reservation*', '*my order*'],
        callback: () => {
          document.getElementById('consultar-reserva')?.scrollIntoView({ behavior: 'smooth' })
          toast(t('voice.consulting'), { icon: '\u{1F50D}' })
        }
      },
      {
        command: ['*bajar*', '*abajo*', '*down*', '*scroll down*'],
        callback: () => {
          window.scrollBy({ top: 600, behavior: 'smooth' })
          toast(t('voice.scrollDown'), { icon: '\u2B07\uFE0F' })
        }
      },
      {
        command: ['*subir*', '*arriba*', '*up*', '*scroll up*'],
        callback: () => {
          window.scrollBy({ top: -600, behavior: 'smooth' })
          toast(t('voice.scrollUp'), { icon: '\u2B06\uFE0F' })
        }
      },
      stopCmd
    ]
  }, [t])

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition({ commands })

  const handleToggle = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening()
    } else {
      if (!isMicrophoneAvailable) {
        toast.error(t('voice.microphoneError'))
        return
      }
      SpeechRecognition.startListening({ continuous: true, language: i18n.language === 'en' ? 'en-US' : 'es-MX' })
      toast.success(t('voice.activated'))
    }
  }, [listening, isMicrophoneAvailable, i18n.language, t])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (transcript) resetTranscript()
    }, 3000)
    return () => clearTimeout(timeout)
  }, [transcript, resetTranscript])

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="voice-navigator">
        <button 
          className="voice-btn"
          onClick={() => toast.error(t('voice.notSupported', 'El control por voz requiere Google Chrome o Edge en escritorio.'))}
          aria-label="Control por voz no soportado"
        >
          <span className="voice-icon" aria-hidden="true">🎤</span>
          <span className="voice-text">{t('voice.notSupported')}</span>
        </button>
      </div>
    )
  }

  return (
    <div className="voice-navigator">
      <button
        className={`voice-btn ${listening ? 'listening' : ''}`}
        onClick={handleToggle}
        aria-label={listening ? t('voice.disable') : t('voice.enable')}
        aria-pressed={listening}
      >
        <span className="voice-icon" aria-hidden="true">
          {listening ? '\u{1F399}\uFE0F' : '\u{1F3A4}'}
        </span>
        <span className="voice-text">
          {listening ? t('voice.listening') : t('voice.button')}
        </span>
        <span className="voice-text-short">
          {listening ? '...' : t('voice.buttonShort')}
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
