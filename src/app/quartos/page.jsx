"use client";

import { useState, useEffect } from "react";

//components
import { QuartosCard } from "../../components/Card";
import { QuartosList } from "../../components/List";
import { CreateButtonQuarto } from "../../components/Botton";
import Search from "../../components/Search";
import ViewToggle from "../../components/ViewToggle";
import useFetch from "../../hooks/useFetch";
import useSearch from "../../hooks/useSearch";
import { atualizarTodosQuartos } from "../../utils/quartoStatus";

const Quartos = () => {
  const { isPending, fetchError, hotler, handleDelete, setOrderBy, orderBy } =
    useFetch("quartos");

  const { isPending: isPendingReservas, hotler: reservas } =
    useFetch("reservas");

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards");

  const { filteredData } = useSearch(hotler, searchTerm);

  useEffect(() => {
    const atualizarStatus = async () => {
      if (hotler && reservas) {
        await atualizarTodosQuartos(hotler, reservas);
      }
    };
    atualizarStatus();
  }, [hotler, reservas]);

  return (
    <div className="quartos">
      <div className="header-pages">
        <h2>Quartos</h2>
        <CreateButtonQuarto />
      </div>
      {fetchError && <p className="error">{fetchError}</p>}
      <div className="loading">
        {(isPending || isPendingReservas) && <p>Carregando...</p>}
      </div>

      {hotler && (
        <div className="quartos">
          <div className="search">
            <Search value={searchTerm} onChange={setSearchTerm} />
          </div>
          <div className="controls-row">
            <div className="order-by">
              <p>Ordenar por: </p>
              <button
                className={orderBy === "numero" ? "active" : ""}
                onClick={() => setOrderBy("numero")}
              >
                Numero
              </button>
              <button
                className={orderBy === "tipo" ? "active" : ""}
                onClick={() => setOrderBy("tipo")}
              >
                Tipo
              </button>
              <button
                className={orderBy === "estado" ? "active" : ""}
                onClick={() => setOrderBy("estado")}
              >
                Estado
              </button>
              <button
                className={orderBy === "ocupado" ? "active" : ""}
                onClick={() => setOrderBy("ocupado")}
              >
                Ocupado
              </button>
            </div>
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>

          {viewMode === "cards" ? (
            <div className="quartos-cards">
              {filteredData.map((quarto) => (
                <QuartosCard
                  key={quarto.id}
                  quarto={quarto}
                  onDelete={handleDelete}
                  reservas={reservas || []}
                />
              ))}
            </div>
          ) : (
            <div className="quartos-list">
              {filteredData.map((quarto) => (
                <QuartosList
                  key={quarto.id}
                  quarto={quarto}
                  onDelete={handleDelete}
                  reservas={reservas || []}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quartos;
