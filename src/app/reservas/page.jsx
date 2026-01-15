"use client";

import { useState } from "react";

//components
import { ReservasCard } from "../../components/Card";
import { ReservasList } from "../../components/List";
import CalendarView from "../../components/CalendarView";
import { CreateButtonReserva } from "../../components/Botton";
import Search from "../../components/Search";
import ViewToggle from "../../components/ViewToggle";
import useFetch from "../../hooks/useFetch";
import useSearch from "../../hooks/useSearch";

const Reservas = () => {
  const { isPending, fetchError, hotler, handleDelete } = useFetch("reservas");
  const { hotler: quartosData } = useFetch("quartos");

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards");

  const { filteredData } = useSearch(hotler, searchTerm);

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
          <div className="controls-row">
            <div className="order-by">
              <p>Ordenar por: </p>
            </div>
            <ViewToggle
              viewMode={viewMode}
              setViewMode={setViewMode}
              showCalendar={true}
            />
          </div>

          {viewMode !== "calendar" && (
            <div className="search">
              <Search value={searchTerm} onChange={setSearchTerm} />
            </div>
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
