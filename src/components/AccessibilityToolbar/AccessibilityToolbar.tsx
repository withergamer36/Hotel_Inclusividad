import { useState, useEffect, useRef } from 'react'
import './AccessibilityToolbar.css'

export interface AccessibilityState {
  fontSize: number
  dyslexiaFont: boolean
  highContrast: boolean
  darkMode: boolean
  reduceMotion: boolean
  increasedSpacing: boolean
  readingLine: boolean
  isSpeaking: boolean
  speechRate: number
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
  immersiveReading: boolean
  largeCursor: boolean
  highlightLinks: boolean
}

interface AccessibilityToolbarProps {
  state: AccessibilityState
  onChange: (state: AccessibilityState) => void
  onAnnounce?: (message: string) => void
}

export function AccessibilityToolbar({ state, onChange }: AccessibilityToolbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const updateState = (key: keyof AccessibilityState, value: AccessibilityState[keyof AccessibilityState]) => {
    let newState = { ...state, [key]: value }

    // Lógica mutuamente excluyente entre Modo Oscuro y Lectura Inmersiva
    if (key === 'darkMode' && value === true) {
      newState.immersiveReading = false
    } else if (key === 'immersiveReading' && value === true) {
      newState.darkMode = false
    }

    onChange(newState)
  }

  return (
    <div className="accessibility-toolbar" role="region" aria-label="Herramientas de accesibilidad">
      <button
        ref={buttonRef}
        className="accessibility-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        aria-label={isOpen ? 'Cerrar panel de accesibilidad' : 'Abrir panel de accesibilidad'}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l2 2" />
          <path d="M8 16s1.5-2 4-2 4 2 4 2" />
          <path d="M9 9h.01M15 9h.01" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          id="accessibility-panel"
          className="accessibility-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Opciones de accesibilidad"
        >
          <div className="accessibility-panel-header">
            <h2 className="accessibility-panel-title">Opciones de Accesibilidad</h2>
            <button
              className="accessibility-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar panel"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="accessibility-panel-content">
            <div className="accessibility-section">
              <h3 className="accessibility-section-title">Texto</h3>

              <div className="accessibility-option">
                <span className="accessibility-label">Tamaño de fuente</span>
                <div className="accessibility-row">
                  <button
                    onClick={() => updateState('fontSize', Math.max(0.8, state.fontSize - 0.1))}
                    aria-label="Reducir tamaño de fuente"
                    className="accessibility-btn"
                  >
                    A-
                  </button>
                  <span className="accessibility-value" aria-live="polite">
                    {Math.round(state.fontSize * 100)}%
                  </span>
                  <button
                    onClick={() => updateState('fontSize', Math.min(1.5, state.fontSize + 0.1))}
                    aria-label="Aumentar tamaño de fuente"
                    className="accessibility-btn"
                  >
                    A+
                  </button>
                </div>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">Fuente para dislexia</span>
                <button
                  onClick={() => updateState('dyslexiaFont', !state.dyslexiaFont)}
                  aria-pressed={state.dyslexiaFont}
                  className={`accessibility-toggle-btn ${state.dyslexiaFont ? 'active' : ''}`}
                >
                  {state.dyslexiaFont ? 'Activado' : 'Desactivado'}
                </button>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">Espaciado de texto</span>
                <button
                  onClick={() => updateState('increasedSpacing', !state.increasedSpacing)}
                  aria-pressed={state.increasedSpacing}
                  className={`accessibility-toggle-btn ${state.increasedSpacing ? 'active' : ''}`}
                >
                  {state.increasedSpacing ? 'Activado' : 'Desactivado'}
                </button>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">Guía de lectura</span>
                <button
                  onClick={() => updateState('readingLine', !state.readingLine)}
                  aria-pressed={state.readingLine}
                  className={`accessibility-toggle-btn ${state.readingLine ? 'active' : ''}`}
                >
                  {state.readingLine ? 'Activado' : 'Desactivado'}
                </button>
              </div>
            </div>

            <div className="accessibility-section">
              <h3 className="accessibility-section-title">Visual</h3>

              <div className="accessibility-option">
                <span className="accessibility-label">Alto contraste</span>
                <button
                  onClick={() => updateState('highContrast', !state.highContrast)}
                  aria-pressed={state.highContrast}
                  className={`accessibility-toggle-btn ${state.highContrast ? 'active' : ''}`}
                >
                  {state.highContrast ? 'Activado' : 'Desactivado'}
                </button>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">Modo oscuro</span>
                <button
                  onClick={() => updateState('darkMode', !state.darkMode)}
                  aria-pressed={state.darkMode}
                  className={`accessibility-toggle-btn ${state.darkMode ? 'active' : ''}`}
                >
                  {state.darkMode ? 'Activado' : 'Desactivado'}
                </button>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">Reducir animaciones</span>
                <button
                  onClick={() => updateState('reduceMotion', !state.reduceMotion)}
                  aria-pressed={state.reduceMotion}
                  className={`accessibility-toggle-btn ${state.reduceMotion ? 'active' : ''}`}
                >
                  {state.reduceMotion ? 'Activado' : 'Desactivado'}
                </button>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">Resaltar enlaces</span>
                <button
                  onClick={() => updateState('highlightLinks', !state.highlightLinks)}
                  aria-pressed={state.highlightLinks}
                  className={`accessibility-toggle-btn ${state.highlightLinks ? 'active' : ''}`}
                >
                  {state.highlightLinks ? 'Activado' : 'Desactivado'}
                </button>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">Cursor grande</span>
                <button
                  onClick={() => updateState('largeCursor', !state.largeCursor)}
                  aria-pressed={state.largeCursor}
                  className={`accessibility-toggle-btn ${state.largeCursor ? 'active' : ''}`}
                >
                  {state.largeCursor ? 'Activado' : 'Desactivado'}
                </button>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">Filtros para Daltonismo</span>
                <div className="color-blind-grid">
                  <button
                    onClick={() => updateState('colorBlindMode', 'none')}
                    aria-pressed={state.colorBlindMode === 'none'}
                    className={`accessibility-toggle-btn ${state.colorBlindMode === 'none' ? 'active' : ''}`}
                  >
                    Estándar
                  </button>
                  <button
                    onClick={() => updateState('colorBlindMode', 'protanopia')}
                    aria-pressed={state.colorBlindMode === 'protanopia'}
                    className={`accessibility-toggle-btn ${state.colorBlindMode === 'protanopia' ? 'active' : ''}`}
                    title="Protanopía (Rojo-Verde)"
                  >
                    Protanopía
                  </button>
                  <button
                    onClick={() => updateState('colorBlindMode', 'deuteranopia')}
                    aria-pressed={state.colorBlindMode === 'deuteranopia'}
                    className={`accessibility-toggle-btn ${state.colorBlindMode === 'deuteranopia' ? 'active' : ''}`}
                    title="Deuteranopía (Verde-Rojo)"
                  >
                    Deuteranopía
                  </button>
                  <button
                    onClick={() => updateState('colorBlindMode', 'tritanopia')}
                    aria-pressed={state.colorBlindMode === 'tritanopia'}
                    className={`accessibility-toggle-btn ${state.colorBlindMode === 'tritanopia' ? 'active' : ''}`}
                    title="Tritanopía (Azul-Amarillo)"
                  >
                    Tritanopía
                  </button>
                  <button
                    onClick={() => updateState('colorBlindMode', 'achromatopsia')}
                    aria-pressed={state.colorBlindMode === 'achromatopsia'}
                    className={`accessibility-toggle-btn ${state.colorBlindMode === 'achromatopsia' ? 'active' : ''}`}
                    title="Acromatopsia (Monocromático)"
                  >
                    Acromatopsia
                  </button>
                </div>
              </div>
            </div>

            <div className="accessibility-section">
              <h3 className="accessibility-section-title">Cognitivo</h3>
              <div className="accessibility-option">
                <span className="accessibility-label">Lectura inmersiva (Sin distracciones)</span>
                <button
                  onClick={() => updateState('immersiveReading', !state.immersiveReading)}
                  aria-pressed={state.immersiveReading}
                  className={`accessibility-toggle-btn ${state.immersiveReading ? 'active' : ''}`}
                >
                  {state.immersiveReading ? 'Activado' : 'Desactivado'}
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.speechSynthesis) {
                  window.speechSynthesis.cancel()
                }
                onChange({
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
              }}
              className="accessibility-reset"
            >
              Restablecer valores
            </button>
          </div>
        </div>
      )}
    </div>
    )
    }