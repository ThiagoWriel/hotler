"use client";

/**
 * Componente de filtro por intervalo de datas.
 * Funciona de forma independente do componente Search.
 *
 * @param {string} startDate - Data inicial selecionada
 * @param {string} endDate - Data final selecionada
 * @param {function} onStartDateChange - Callback para mudança da data inicial
 * @param {function} onEndDateChange - Callback para mudança da data final
 * @param {string} labelStart - Label para o campo de data inicial
 * @param {string} labelEnd - Label para o campo de data final
 */
const DateFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  labelStart = "De",
  labelEnd = "Até",
}) => {
  return (
    <div className="date-filter">
      <div className="date-filter-group">
        <label className="date-filter-label">{labelStart}:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="date-filter-input"
        />
      </div>
      <div className="date-filter-separator">
        <i className="material-icons">arrow_forward</i>
      </div>
      <div className="date-filter-group">
        <label className="date-filter-label">{labelEnd}:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="date-filter-input"
        />
      </div>
    </div>
  );
};

export default DateFilter;
