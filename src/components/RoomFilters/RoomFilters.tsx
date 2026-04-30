import { accessibilityFilterOptions } from '../../data/hotelData'
import './RoomFilters.css'

interface RoomFiltersProps {
  activeFilters: string[]
  onFilterChange: (filters: string[]) => void
  roomCount: number
}

export function RoomFilters({ activeFilters, onFilterChange, roomCount }: RoomFiltersProps) {

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

  return (
    <div className="room-filters" role="group" aria-label="Filtros de accesibilidad para habitaciones">
      <div className="filters-header">
        <h3 className="filters-title">Filtros de Accesibilidad</h3>
        {activeFilters.length > 0 && (
          <button
            className="clear-filters-btn"
            onClick={clearFilters}
            aria-label="Limpiar todos los filtros"
          >
            Limpiar filtros
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
              aria-label={`Filtrar por: ${filter.label}`}
            >
              <span className="filter-check" aria-hidden="true">
                {isActive ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : null}
              </span>
              {filter.label}
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
          <span>Mostrando las {roomCount} habitaciones disponibles</span>
        ) : roomCount === 0 ? (
          <span className="no-results">No se encontraron habitaciones con los filtros seleccionados</span>
        ) : (
          <span>Se encontraron {roomCount} habitación{roomCount !== 1 ? 'es' : ''} con los filtros seleccionados</span>
        )}
      </div>
    </div>
  )
}
