import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
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

function LanguageIcon() {
  return (
    <svg viewBox="0 0 512 512" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g id="Language_translator">
        <path d="M170.5,409.9019H151.6113a11.53,11.53,0,0,1-11.5132-11.5132V332a17.0951,17.0951,0,0,0-29.1865-12.0884L70.583,360.24A17.0956,17.0956,0,0,0,94.76,384.417l11.1421-11.1328v25.1045a45.7583,45.7583,0,0,0,45.7094,45.7094H170.5a17.0981,17.0981,0,0,0,0-34.1962Z"/>
        <path d="M341.5,102.0981h18.9258a11.49,11.49,0,0,1,11.4761,11.4761V180a17.0956,17.0956,0,0,0,29.1865,12.0884L441.417,151.76A17.0956,17.0956,0,0,0,417.24,127.583l-11.1421,11.1328V113.5742a45.7186,45.7186,0,0,0-45.6723-45.6723H341.5a17.0981,17.0981,0,1,0,0,34.1962Z"/>
        <path d="M341.5568,357.965a219.3123,219.3123,0,0,0,15.8144-18.3669H325.725A223.0726,223.0726,0,0,0,341.5568,357.965Z"/>
        <path d="M455.5,219.9019H301.5981V47A17.0965,17.0965,0,0,0,284.5,29.9019H56.5A17.0965,17.0965,0,0,0,39.4019,47V275A17.0965,17.0965,0,0,0,56.5,292.0981H210.4019V465A17.0965,17.0965,0,0,0,227.5,482.0981h228A17.0965,17.0965,0,0,0,472.5981,465V237A17.0965,17.0965,0,0,0,455.5,219.9019ZM233.2983,200.8555l-47.5-95c-5.8076-11.5967-24.789-11.5967-30.5966,0l-47.5,95a17.1019,17.1019,0,0,0,30.5966,15.289l4.7721-9.5464H197.93l4.7721,9.5464a16.9394,16.9394,0,0,0,12.4977,9.0756A16.986,16.986,0,0,0,210.4019,237v20.9019H73.5981V64.0981H267.4019V219.9019H230.6334A17.0235,17.0235,0,0,0,233.2983,200.8555Zm-52.4645-28.4536H160.1662l10.3338-20.67ZM408,339.5981h-9.0918a249.0189,249.0189,0,0,1-31.5917,40.9711,167.6724,167.6724,0,0,0,37.4828,21.0387,17.0951,17.0951,0,1,1-12.5986,31.7842A205.0476,205.0476,0,0,1,341.5,404.0479a205.0476,205.0476,0,0,1-50.7007,29.3442,16.9144,16.9144,0,0,1-6.29,1.2153,17.103,17.103,0,0,1-6.3086-33,168.5475,168.5475,0,0,0,37.5164-21.0039,249.0876,249.0876,0,0,1-31.6253-41.0059H275a17.0981,17.0981,0,0,1,0-34.1962h49.4019V284.5a17.0981,17.0981,0,0,1,34.1962,0v20.9019H408a17.0981,17.0981,0,0,1,0,34.1962Z"/>
      </g>
    </svg>
  )
}

export function AccessibilityToolbar({ state, onChange }: AccessibilityToolbarProps) {
  const { t, i18n } = useTranslation()
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
    const newState = { ...state, [key]: value }

    if (key === 'darkMode' && value === true) {
      newState.immersiveReading = false
    } else if (key === 'immersiveReading' && value === true) {
      newState.darkMode = false
    }

    onChange(newState)
  }

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es'
    i18n.changeLanguage(nextLang)
  }

  return (
    <div className="accessibility-toolbar" role="region" aria-label={t('accessibility.toolbarLabel')}>
      <button
        ref={buttonRef}
        className="accessibility-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        aria-label={isOpen ? t('accessibility.closePanel') : t('accessibility.openPanel')}
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
          aria-label={t('accessibility.panelTitle')}
        >
          <div className="accessibility-panel-header">
            <h2 className="accessibility-panel-title">{t('accessibility.panelTitle')}</h2>
            <button
              className="accessibility-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label={t('accessibility.closeBtn')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="accessibility-panel-content">
            <div className="accessibility-section">
              <h3 className="accessibility-section-title">{t('accessibility.sections.text')}</h3>

              <div className="accessibility-option">
                <span className="accessibility-label">{t('accessibility.fontSize')}</span>
                <div className="accessibility-row">
                  <button
                    onClick={() => updateState('fontSize', Math.max(0.8, state.fontSize - 0.1))}
                    aria-label={t('accessibility.decreaseFont')}
                    className="accessibility-btn"
                  >
                    A-
                  </button>
                  <span className="accessibility-value" aria-live="polite">
                    {Math.round(state.fontSize * 100)}%
                  </span>
                  <button
                    onClick={() => updateState('fontSize', Math.min(1.5, state.fontSize + 0.1))}
                    aria-label={t('accessibility.increaseFont')}
                    className="accessibility-btn"
                  >
                    A+
                  </button>
                </div>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">{t('accessibility.dyslexiaFont')}</span>
                <button
                  onClick={() => updateState('dyslexiaFont', !state.dyslexiaFont)}
                  aria-pressed={state.dyslexiaFont}
                  className={`accessibility-toggle-btn ${state.dyslexiaFont ? 'active' : ''}`}
                >
                  {state.dyslexiaFont ? t('accessibility.on') : t('accessibility.off')}
                </button>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">{t('accessibility.textSpacing')}</span>
                <button
                  onClick={() => updateState('increasedSpacing', !state.increasedSpacing)}
                  aria-pressed={state.increasedSpacing}
                  className={`accessibility-toggle-btn ${state.increasedSpacing ? 'active' : ''}`}
                >
                  {state.increasedSpacing ? t('accessibility.on') : t('accessibility.off')}
                </button>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">{t('accessibility.readingGuide')}</span>
                <button
                  onClick={() => updateState('readingLine', !state.readingLine)}
                  aria-pressed={state.readingLine}
                  className={`accessibility-toggle-btn ${state.readingLine ? 'active' : ''}`}
                >
                  {state.readingLine ? t('accessibility.on') : t('accessibility.off')}
                </button>
              </div>
            </div>

            <div className="accessibility-section">
              <h3 className="accessibility-section-title">{t('accessibility.sections.visual')}</h3>

              <div className="accessibility-option">
                <span className="accessibility-label">{t('accessibility.highContrast')}</span>
                <button
                  onClick={() => updateState('highContrast', !state.highContrast)}
                  aria-pressed={state.highContrast}
                  className={`accessibility-toggle-btn ${state.highContrast ? 'active' : ''}`}
                >
                  {state.highContrast ? t('accessibility.on') : t('accessibility.off')}
                </button>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">{t('accessibility.darkMode')}</span>
                <button
                  onClick={() => updateState('darkMode', !state.darkMode)}
                  aria-pressed={state.darkMode}
                  className={`accessibility-toggle-btn ${state.darkMode ? 'active' : ''}`}
                >
                  {state.darkMode ? t('accessibility.on') : t('accessibility.off')}
                </button>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">{t('accessibility.reduceMotion')}</span>
                <button
                  onClick={() => updateState('reduceMotion', !state.reduceMotion)}
                  aria-pressed={state.reduceMotion}
                  className={`accessibility-toggle-btn ${state.reduceMotion ? 'active' : ''}`}
                >
                  {state.reduceMotion ? t('accessibility.on') : t('accessibility.off')}
                </button>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">{t('accessibility.highlightLinks')}</span>
                <button
                  onClick={() => updateState('highlightLinks', !state.highlightLinks)}
                  aria-pressed={state.highlightLinks}
                  className={`accessibility-toggle-btn ${state.highlightLinks ? 'active' : ''}`}
                >
                  {state.highlightLinks ? t('accessibility.on') : t('accessibility.off')}
                </button>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">{t('accessibility.largeCursor')}</span>
                <button
                  onClick={() => updateState('largeCursor', !state.largeCursor)}
                  aria-pressed={state.largeCursor}
                  className={`accessibility-toggle-btn ${state.largeCursor ? 'active' : ''}`}
                >
                  {state.largeCursor ? t('accessibility.on') : t('accessibility.off')}
                </button>
              </div>

              <div className="accessibility-option">
                <span className="accessibility-label">{t('accessibility.colorBlindFilters')}</span>
                <div className="color-blind-grid">
                  <button
                    onClick={() => updateState('colorBlindMode', 'none')}
                    aria-pressed={state.colorBlindMode === 'none'}
                    className={`accessibility-toggle-btn ${state.colorBlindMode === 'none' ? 'active' : ''}`}
                  >
                    {t('accessibility.standard')}
                  </button>
                  <button
                    onClick={() => updateState('colorBlindMode', 'protanopia')}
                    aria-pressed={state.colorBlindMode === 'protanopia'}
                    className={`accessibility-toggle-btn ${state.colorBlindMode === 'protanopia' ? 'active' : ''}`}
                    title={t('accessibility.protanopiaTitle')}
                  >
                    {t('accessibility.protanopia')}
                  </button>
                  <button
                    onClick={() => updateState('colorBlindMode', 'deuteranopia')}
                    aria-pressed={state.colorBlindMode === 'deuteranopia'}
                    className={`accessibility-toggle-btn ${state.colorBlindMode === 'deuteranopia' ? 'active' : ''}`}
                    title={t('accessibility.deuteranopiaTitle')}
                  >
                    {t('accessibility.deuteranopia')}
                  </button>
                  <button
                    onClick={() => updateState('colorBlindMode', 'tritanopia')}
                    aria-pressed={state.colorBlindMode === 'tritanopia'}
                    className={`accessibility-toggle-btn ${state.colorBlindMode === 'tritanopia' ? 'active' : ''}`}
                    title={t('accessibility.tritanopiaTitle')}
                  >
                    {t('accessibility.tritanopia')}
                  </button>
                  <button
                    onClick={() => updateState('colorBlindMode', 'achromatopsia')}
                    aria-pressed={state.colorBlindMode === 'achromatopsia'}
                    className={`accessibility-toggle-btn ${state.colorBlindMode === 'achromatopsia' ? 'active' : ''}`}
                    title={t('accessibility.achromatopsiaTitle')}
                  >
                    {t('accessibility.achromatopsia')}
                  </button>
                </div>
              </div>
            </div>

            <div className="accessibility-section">
              <h3 className="accessibility-section-title">{t('accessibility.sections.cognitive')}</h3>
              <div className="accessibility-option">
                <span className="accessibility-label">{t('accessibility.immersiveReading')}</span>
                <button
                  onClick={() => updateState('immersiveReading', !state.immersiveReading)}
                  aria-pressed={state.immersiveReading}
                  className={`accessibility-toggle-btn ${state.immersiveReading ? 'active' : ''}`}
                >
                  {state.immersiveReading ? t('accessibility.on') : t('accessibility.off')}
                </button>
              </div>
            </div>

            <div className="accessibility-section">
              <h3 className="accessibility-section-title">{t('accessibility.sections.language')}</h3>
              <div className="accessibility-option">
                <span className="accessibility-label">{t('accessibility.languageLabel')}</span>
                <button
                  onClick={toggleLanguage}
                  className="accessibility-language-btn"
                  aria-label={t('accessibility.languageLabel')}
                  aria-pressed={false}
                >
                  <LanguageIcon />
                  <span className="language-label-text">{i18n.language === 'es' ? 'EN' : 'ES'}</span>
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
              {t('accessibility.reset')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
