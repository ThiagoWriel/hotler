"use client";

import { useState } from "react";

//components
import { ReservasCard } from "../../components/Card";
import { ReservasList } from "../../components/List";
import CalendarView from "../../components/CalendarView";
import { CreateButtonReserva } from "../../components/ActionButtons";
import Search from "../../components/Search";
import DateFilter from "../../components/DateFilter";
import ViewToggle from "../../components/ViewToggle";
import { Button } from "@/components/ui/button";
import useFetch from "../../hooks/useFetch";
import useSearch from "../../hooks/useSearch";
import useDateFilter from "../../hooks/useDateFilter";

const Reservas = () => {
  const { isPending, fetchError, hotler, handleDelete, orderBy, setOrderBy } =
    useFetch("reservas");
  const { hotler: quartosData } = useFetch("quartos");

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filtro de data aplicado primeiro, depois o filtro de busca
  const { filteredData: dateFiltered } = useDateFilter(
    hotler,
    startDate,
    endDate,
    "checkin",
  );
  const { filteredData } = useSearch(dateFiltered, searchTerm);

  return (
    <div className="reservas">
      <div className="header-pages">
        <h2>Reservas</h2>
        <CreateButtonReserva />
      </div>
      {fetchError && <p className="error">{fetchError}</p>}
      <div className="loading">{isPending && <p>Carregando...</p>}</div>

      {hotler && (
        <div className="reservas">
          <div className="search">
            <Search value={searchTerm} onChange={setSearchTerm} />
          </div>
          <div className="controls-row">
            <div className="order-by">
              <p>Ordenar por: </p>
              <Button
                variant={orderBy === "estado_reserva" ? "default" : "outline"}
                onClick={() => setOrderBy("estado_reserva")}
                size="sm"
              >
                Estado
              </Button>
              <Button
                variant={orderBy === "checkin" ? "default" : "outline"}
                onClick={() => setOrderBy("checkin")}
                size="sm"
              >
                Check-in
              </Button>
              <Button
                variant={orderBy === "checkout" ? "default" : "outline"}
                onClick={() => setOrderBy("checkout")}
                size="sm"
              >
                Check-out
              </Button>
            </div>
            <ViewToggle
              viewMode={viewMode}
              setViewMode={setViewMode}
              showCalendar={true}
            />
          </div>

          {viewMode !== "calendar" && (
            <>
              <div className="filter-section">
                <DateFilter
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                />
              </div>
            </>
          )}

          {viewMode === "cards" && (
            <div className="reservas-cards">
              {filteredData.map((reserva) => (
                <ReservasCard
                  key={reserva.id}
                  reserva={reserva}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <div className="reservas-list">
              {filteredData.map((reserva) => (
                <ReservasList
                  key={reserva.id}
                  reserva={reserva}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {viewMode === "calendar" && quartosData && (
            <CalendarView reservas={hotler} quartos={quartosData} />
          )}
        </div>
      )}
    </div>
  );
};

export default Reservas;
