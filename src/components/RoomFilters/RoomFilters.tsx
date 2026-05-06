import { useTranslation } from 'react-i18next'
import { accessibilityFilterOptions } from '../../data/hotelData'
import './RoomFilters.css'

interface RoomFiltersProps {
  activeFilters: string[]
  onFilterChange: (filters: string[]) => void
  roomCount: number
}

export function RoomFilters({ activeFilters, onFilterChange, roomCount }: RoomFiltersProps) {
  const { t } = useTranslation()

  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      onFilterChange(activeFilters.filter(f => f !== filterId))
    } else {
      onFilterChange([...activeFilters, filterId])
    }
  }

  const clearFilters = () => {
    onFilterChange([])
  }

  const getFilterLabel = (id: string) => t(`hotel.filterOptions.${id}`)

  return (
    <div className="room-filters" role="group" aria-label={t('roomFilters.ariaLabel')}>
      <div className="filters-header">
        <h3 className="filters-title">{t('roomFilters.title')}</h3>
        {activeFilters.length > 0 && (
          <button
            className="clear-filters-btn"
            onClick={clearFilters}
            aria-label={t('roomFilters.clearAllFilters')}
          >
            {t('roomFilters.clearFilters')}
          </button>
        )}
      </div>

      <div className="filters-grid">
        {accessibilityFilterOptions.map((filter) => {
          const isActive = activeFilters.includes(filter.id)
          return (
            <button
              key={filter.id}
              className={`filter-chip ${isActive ? 'active' : ''}`}
              onClick={() => toggleFilter(filter.id)}
              aria-pressed={isActive}
              aria-label={t('roomFilters.filterBy', { label: getFilterLabel(filter.id) })}
            >
              <span className="filter-check" aria-hidden="true">
                {isActive ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : null}
              </span>
              {getFilterLabel(filter.id)}
            </button>
          )
        })}
      </div>

      <div
        className="room-count-announcement"
        aria-live="polite"
        aria-atomic="true"
      >
        {activeFilters.length === 0 ? (
          <span>{t('roomFilters.showingAll', { count: roomCount })}</span>
        ) : roomCount === 0 ? (
          <span className="no-results">{t('roomFilters.noResults')}</span>
        ) : (
          <span>{roomCount === 1 ? t('roomFilters.foundResults', { count: roomCount }) : t('roomFilters.foundResults_plural', { count: roomCount })}</span>
        )}
      </div>
    </div>
  )
}
