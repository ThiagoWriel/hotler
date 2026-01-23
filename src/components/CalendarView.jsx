"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * CalendarView - Componente de visualização de calendário para reservas
 *
 * Props:
 * - reservas: Array de reservas com campos (cliente_id, checkin, checkout, quarto_id, pessoas, estado_reserva)
 * - quartos: Array de quartos com campos (numero, tipo, estado)
 * - daysToShow: Número de dias a exibir no futuro (padrão: 90 dias)
 * - daysPast: Número de dias no passado para exibir (padrão: 30 dias)
 */
const CalendarView = ({
  reservas = [],
  quartos = [],
  daysToShow = 90,
  daysPast = 30,
}) => {
  const router = useRouter();
  const scrollContainerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState("");

  // Gera array de dias incluindo dias passados e futuros
  const generateDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Começa X dias no passado
    for (let i = -daysPast; i < daysToShow; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const days = generateDays();

  // Agrupa dias por mês para exibição do header
  const getMonthGroups = () => {
    const groups = [];
    let currentMonth = null;
    let currentGroup = null;

    days.forEach((day, index) => {
      const monthKey = `${day.getFullYear()}-${day.getMonth()}`;

      if (monthKey !== currentMonth) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentMonth = monthKey;
        currentGroup = {
          month: day.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          }),
          startIndex: index,
          count: 1,
        };
      } else {
        currentGroup.count++;
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const monthGroups = getMonthGroups();

  // Verifica se uma data é hoje
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Formata data para comparação
  // Formata data para comparação
  const formatDateForComparison = (date) => {
    // Se for string, tenta extrair a parte da data YYYY-MM-DD
    if (typeof date === "string") {
      // Se for formato YYYY-MM-DD, retorna direto (evita conversão para UTC e problema de timezone)
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      // Se for ISO string (ex: YYYY-MM-DDT...), pega a primeira parte
      if (date.includes("T")) {
        return date.split("T")[0];
      }
    }

    // Para objetos Date (como os dias gerados no calendário) ou strings não tratadas acima
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // Encontra reserva para um quarto/dia específico
  const getReservationForCell = (quarto, date) => {
    const dateStr = formatDateForComparison(date);

    return reservas.find((reserva) => {
      // Compara usando ID do quarto
      if (reserva.quarto_id !== quarto.id) return false;
      if (reserva.estado_reserva === "cancelada") return false;

      const checkinDate = formatDateForComparison(reserva.checkin);
      const checkoutDate = formatDateForComparison(reserva.checkout);

      return dateStr >= checkinDate && dateStr <= checkoutDate;
    });
  };

  // Verifica se é o primeiro dia da reserva (check-in)
  const isCheckinDay = (reserva, date) => {
    const dateStr = formatDateForComparison(date);
    const checkinDate = formatDateForComparison(reserva.checkin);
    return dateStr === checkinDate;
  };

  // Verifica se é o último dia da reserva (check-out)
  const isCheckoutDay = (reserva, date) => {
    const dateStr = formatDateForComparison(date);
    const checkoutDate = formatDateForComparison(reserva.checkout);
    return dateStr === checkoutDate;
  };

  // Navega para criar reserva com parâmetros pré-selecionados
  const handleCellClick = (quarto, date) => {
    const reserva = getReservationForCell(quarto, date);

    if (!reserva) {
      const formattedDate = formatDateForComparison(date);
      // Navega para criar reserva com quarto e data pré-selecionados
      const url = `/reservas/create?quarto=${quarto.id}&checkin=${formattedDate}`;
      console.log("Navegando para:", url);
      router.push(url);
    }
  };

  // Navega para a data selecionada
  const handleDatePickerChange = (e) => {
    const targetDate = new Date(e.target.value);
    setSelectedDate(e.target.value);

    // Encontra o índice do dia no array (considerando dias passados)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // O índice no array é diffDays + daysPast (pois começamos daysPast dias atrás)
    const arrayIndex = diffDays + daysPast;

    if (
      arrayIndex >= 0 &&
      arrayIndex < days.length &&
      scrollContainerRef.current
    ) {
      // Calcula a posição de scroll (80px por coluna + 120px da coluna de quartos)
      const scrollPosition = arrayIndex * 80 - 200;
      scrollContainerRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      });
    }
  };

  // Scroll para o dia atual ao montar (posição = daysPast * 80px - um pouco de margem)
  useEffect(() => {
    if (scrollContainerRef.current) {
      setTimeout(() => {
        // Scroll para o dia atual (que está na posição daysPast do array)
        const scrollPosition = daysPast * 80 - 200;
        scrollContainerRef.current.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: "instant",
        });
      }, 100);
    }
  }, [daysPast]);

  // Ordena quartos por número
  const sortedQuartos = [...(quartos || [])].sort(
    (a, b) => a.numero - b.numero,
  );

  // Calcula os limites de data para o date picker
  const minDate = formatDateForComparison(days[0]);
  const maxDate = formatDateForComparison(days[days.length - 1]);

  return (
    <div className="calendar-view">
      {/* Controles do calendário */}
      <div className="calendar-controls">
        <div className="calendar-date-picker">
          <label htmlFor="calendar-goto">Ir para data:</label>
          <input
            type="date"
            id="calendar-goto"
            value={selectedDate}
            onChange={handleDatePickerChange}
            min={minDate}
            max={maxDate}
          />
        </div>
        <div className="calendar-legend">
          <span className="legend-item">
            <span className="legend-color legend-reserved"></span>
            Reservado
          </span>
          <span className="legend-item">
            <span className="legend-color legend-available"></span>
            Disponível
          </span>
        </div>
      </div>

      {/* Container com scroll */}
      <div className="calendar-scroll-container" ref={scrollContainerRef}>
        <div className="calendar-grid">
          {/* Header dos meses */}
          <div className="calendar-month-row">
            <div className="calendar-room-header-placeholder"></div>
            {monthGroups.map((group, index) => (
              <div
                key={index}
                className="calendar-month-cell"
                style={{ width: `${group.count * 80}px` }}
              >
                {group.month}
              </div>
            ))}
          </div>

          {/* Header dos dias */}
          <div className="calendar-days-row">
            <div className="calendar-room-header">Quartos</div>
            {days.map((day, index) => (
              <div
                key={index}
                className={`calendar-day-cell ${
                  isToday(day) ? "calendar-day-today" : ""
                }`}
              >
                <span className="day-name">
                  {day.toLocaleDateString("pt-BR", { weekday: "short" })}
                </span>
                <span className="day-number">{day.getDate()}</span>
              </div>
            ))}
          </div>

          {/* Linhas dos quartos */}
          {sortedQuartos.map((quarto) => (
            <div key={quarto.numero} className="calendar-room-row">
              <div className="calendar-room-cell">
                <span className="room-number">{quarto.numero}</span>
                <span className="room-type">{quarto.tipo}</span>
              </div>
              {days.map((day, dayIndex) => {
                const reserva = getReservationForCell(quarto, day);
                const isCheckin = reserva && isCheckinDay(reserva, day);
                const isCheckout = reserva && isCheckoutDay(reserva, day);

                return (
                  <div
                    key={dayIndex}
                    className={`calendar-cell 
                      ${isToday(day) ? "calendar-cell-today" : ""} 
                      ${
                        reserva
                          ? "calendar-cell-reserved"
                          : "calendar-cell-available"
                      }
                      ${isCheckin ? "calendar-cell-checkin" : ""}
                      ${isCheckout ? "calendar-cell-checkout" : ""}
                    `}
                    onClick={() => handleCellClick(quarto, day)}
                    title={
                      reserva
                        ? `${reserva.clientes?.nome || "N/A"} - ${reserva.pessoas} pessoa(s)`
                        : `Disponível - Clique para reservar`
                    }
                  >
                    {isCheckin && reserva && (
                      <div className="calendar-reservation">
                        <span className="reservation-name">
                          {reserva.clientes?.nome || "N/A"}
                        </span>
                        <span className="reservation-guests">
                          {reserva.pessoas}p
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
