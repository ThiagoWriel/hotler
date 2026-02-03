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

  // Encontra reservas para um quarto/dia específico
  // Retorna objeto com reserva de checkout (terminando) e/ou checkin (começando)
  const getReservationsForCell = (quarto, date) => {
    const dateStr = formatDateForComparison(date);

    let checkoutReserva = null; // Reserva que termina neste dia
    let checkinReserva = null; // Reserva que começa neste dia
    let midReserva = null; // Reserva que passa por este dia (não começa nem termina)

    reservas.forEach((reserva) => {
      if (reserva.quarto_id !== quarto.id) return;
      if (reserva.estado_reserva === "cancelada") return;

      const checkinDate = formatDateForComparison(reserva.checkin);
      const checkoutDate = formatDateForComparison(reserva.checkout);

      if (dateStr === checkoutDate && dateStr !== checkinDate) {
        // Dia de checkout (não é single-day)
        checkoutReserva = reserva;
      } else if (dateStr === checkinDate && dateStr !== checkoutDate) {
        // Dia de checkin (não é single-day)
        checkinReserva = reserva;
      } else if (dateStr === checkinDate && dateStr === checkoutDate) {
        // Reserva de um único dia
        checkinReserva = reserva;
      } else if (dateStr > checkinDate && dateStr < checkoutDate) {
        // Dia no meio da reserva
        midReserva = reserva;
      }
    });

    return { checkoutReserva, checkinReserva, midReserva };
  };

  // Mantém compatibilidade - retorna a primeira reserva encontrada
  const getReservationForCell = (quarto, date) => {
    const { checkoutReserva, checkinReserva, midReserva } =
      getReservationsForCell(quarto, date);
    return checkinReserva || midReserva || checkoutReserva || null;
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

  // Navega para criar reserva com parâmetros pré-selecionados ou editar reserva existente
  const handleCellClick = (quarto, date, reserva = null) => {
    if (reserva) {
      // Se há reserva, navega para editar
      router.push(`/update-reserva/${reserva.id}`);
    } else {
      const formattedDate = formatDateForComparison(date);
      // Navega para criar reserva com quarto e data pré-selecionados
      const url = `/reservas/create?quarto=${quarto.id}&checkin=${formattedDate}`;
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
                const { checkoutReserva, checkinReserva, midReserva } =
                  getReservationsForCell(quarto, day);

                // Determina o que mostrar
                const hasCheckout = !!checkoutReserva;
                const hasCheckin = !!checkinReserva;
                const hasMid = !!midReserva;

                // Célula precisa ser dividida se tem checkout OU checkin (não meio)
                const needsSplit = (hasCheckout || hasCheckin) && !hasMid;

                // Classes base
                let cellClasses = `calendar-cell ${isToday(day) ? "calendar-cell-today" : ""}`;

                if (hasMid) {
                  // Dia no meio da reserva - célula inteira reservada
                  cellClasses += " calendar-cell-reserved";
                } else if (needsSplit) {
                  // Dia de checkout e/ou checkin - célula dividida
                  cellClasses += " calendar-cell-split";
                } else {
                  // Dia disponível
                  cellClasses += " calendar-cell-available";
                }

                // Título do tooltip
                let titleText = "Disponível - Clique para reservar";
                if (hasMid) {
                  titleText = `${midReserva.clientes?.nome || "N/A"} - ${midReserva.pessoas} pessoa(s)`;
                } else if (hasCheckout && hasCheckin) {
                  titleText = `Checkout: ${checkoutReserva.clientes?.nome || "N/A"} | Checkin: ${checkinReserva.clientes?.nome || "N/A"}`;
                } else if (hasCheckout) {
                  titleText = `Checkout: ${checkoutReserva.clientes?.nome || "N/A"}`;
                } else if (hasCheckin) {
                  titleText = `Checkin: ${checkinReserva.clientes?.nome || "N/A"} - ${checkinReserva.pessoas} pessoa(s)`;
                }

                return (
                  <div
                    key={dayIndex}
                    className={cellClasses}
                    onClick={() =>
                      hasMid
                        ? handleCellClick(quarto, day, midReserva)
                        : handleCellClick(quarto, day)
                    }
                    title={titleText}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Dia no meio da reserva */}
                    {hasMid && null}

                    {/* Dia com checkout e/ou checkin - sempre dividido */}
                    {needsSplit && (
                      <>
                        {/* Metade esquerda - Checkout (ou vazia) */}
                        <div
                          className={`calendar-cell-half calendar-cell-half-left ${hasCheckout ? "half-occupied" : "half-empty"}`}
                          title={
                            hasCheckout
                              ? `Checkout: ${checkoutReserva.clientes?.nome || "N/A"}`
                              : ""
                          }
                          onClick={(e) => {
                            if (hasCheckout) {
                              e.stopPropagation();
                              handleCellClick(quarto, day, checkoutReserva);
                            }
                          }}
                          style={{
                            cursor: hasCheckout ? "pointer" : "default",
                          }}
                        >
                          {hasCheckout && <span className="half-label">↑</span>}
                        </div>

                        {/* Metade direita - Checkin (ou vazia) */}
                        <div
                          className={`calendar-cell-half calendar-cell-half-right ${hasCheckin ? "half-occupied" : "half-empty"}`}
                          title={
                            hasCheckin
                              ? `Checkin: ${checkinReserva.clientes?.nome || "N/A"}`
                              : ""
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            if (hasCheckin) {
                              handleCellClick(quarto, day, checkinReserva);
                            } else {
                              handleCellClick(quarto, day);
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {hasCheckin && (
                            <div className="calendar-reservation">
                              <span className="reservation-name">
                                {checkinReserva.clientes?.nome || "N/A"}
                              </span>
                              <span className="reservation-guests">
                                {checkinReserva.pessoas}p
                              </span>
                            </div>
                          )}
                        </div>
                      </>
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
