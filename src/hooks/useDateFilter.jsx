import { useMemo } from "react";

/**
 * Hook para filtrar dados por intervalo de datas.
 * Funciona de forma independente do useSearch.
 *
 * @param {Array} data - Array de dados a filtrar
 * @param {string} startDate - Data inicial (formato YYYY-MM-DD)
 * @param {string} endDate - Data final (formato YYYY-MM-DD)
 * @param {string} dateField - Nome do campo de data no objeto (ex: "checkin")
 * @returns {{ filteredData: Array }} Dados filtrados pelo intervalo
 */
const useDateFilter = (data, startDate, endDate, dateField = "checkin") => {
  const filteredData = useMemo(() => {
    if (!data) return [];

    // Se não houver filtro, retorna todos os dados
    if (!startDate && !endDate) return data;

    return data.filter((item) => {
      const itemDate = item[dateField];
      if (!itemDate) return false;

      // Converter para comparação de datas
      const itemDateValue = new Date(itemDate).getTime();

      // Validar data inicial
      if (startDate) {
        const startValue = new Date(startDate).getTime();
        if (itemDateValue < startValue) return false;
      }

      // Validar data final
      if (endDate) {
        const endValue = new Date(endDate).getTime();
        if (itemDateValue > endValue) return false;
      }

      return true;
    });
  }, [data, startDate, endDate, dateField]);

  return {
    filteredData,
  };
};

export default useDateFilter;
