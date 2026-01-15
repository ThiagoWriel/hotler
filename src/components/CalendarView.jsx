"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * CalendarView - Componente de visualização de calendário para reservas
 *
 * Props:
 * - reservas: Array de reservas com campos (cliente_reserva, checkin, checkout, quarto_reserva, pessoas, estado_reserva)
 * - quartos: Array de quartos com campos (numero, tipo, estado)
 * - daysToShow: Número de dias a exibir (padrão: 90 dias)
 */
const CalendarView = ({ reservas = [], quartos = [], daysToShow = 90 }) => {
  const router = useRouter();
  const scrollContainerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState("");

  // Gera array de dias a partir de hoje
  const generateDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < daysToShow; i++) {
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
  const formatDateForComparison = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // Encontra reserva para um quarto/dia específico
  const getReservationForCell = (quartoNumero, date) => {
    const dateStr = formatDateForComparison(date);

    return reservas.find((reserva) => {
      if (reserva.quarto_reserva !== quartoNumero) return false;
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
  const handleCellClick = (quartoNumero, date) => {
    const reserva = getReservationForCell(quartoNumero, date);

    if (!reserva) {
      const formattedDate = formatDateForComparison(date);
      // Navega para criar reserva com quarto e data pré-selecionados
      router.push(
        `/reservas/create?quarto=${quartoNumero}&checkin=${formattedDate}`
      );
    }
  };

  // Navega para a data selecionada
  const handleDatePickerChange = (e) => {
    const targetDate = new Date(e.target.value);
    setSelectedDate(e.target.value);

    // Encontra o índice do dia no array
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < daysToShow && scrollContainerRef.current) {
      // Calcula a posição de scroll (80px por coluna + 120px da coluna de quartos)
      const scrollPosition = 120 + diffDays * 80 - 200;
      scrollContainerRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      });
    }
  };

  // Scroll para o dia atual ao montar
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Pequeno delay para garantir que o DOM está pronto
      setTimeout(() => {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: "instant" });
      }, 100);
    }
  }, []);

  // Ordena quartos por número
  const sortedQuartos = [...(quartos || [])].sort(
    (a, b) => a.numero - b.numero
  );

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
            min={formatDateForComparison(new Date())}
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
            <div className="calendar-room-header"></div>
            {monthGroups.map((group, index) => (
              <div
                key={index}
                className="calendar-month-cell"
                style={{ gridColumn: `span ${group.count}` }}
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
                const reserva = getReservationForCell(quarto.numero, day);
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
                    onClick={() => handleCellClick(quarto.numero, day)}
                    title={
                      reserva
                        ? `${reserva.cliente_reserva} - ${reserva.pessoas} pessoa(s)`
                        : `Disponível - Clique para reservar`
                    }
                  >
                    {isCheckin && reserva && (
                      <div className="calendar-reservation">
                        <span className="reservation-name">
                          {reserva.cliente_reserva}
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
