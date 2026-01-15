"use client";

import { useState } from "react";
import { CreateButtonFinanceiro } from "../../components/Botton";
import { FinanceiroCard, FinanceiroReservasCard } from "../../components/Card";
import { FinanceiroList, FinanceiroReservasList } from "../../components/List";
import Search from "../../components/Search";
import ViewToggle from "../../components/ViewToggle";
import useFetch from "../../hooks/useFetch";
import useSearch from "../../hooks/useSearch";

const Financeiro = () => {
  const {
    isPending: isPendingFinanceiro,
    fetchError: fetchErrorFinanceiro,
    hotler: financeiroData,
    handleDelete: handleDeleteFinanceiro,
  } = useFetch("financeiro");

  const {
    isPending: isPendingReservas,
    fetchError: fetchErrorReservas,
    hotler: reservasData,
    handleDelete: handleDeleteReservas,
  } = useFetch("reservas");

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards");

  const { filteredData: filteredFinanceiro } = useSearch(
    financeiroData,
    searchTerm
  );
  const { filteredData: filteredReservas } = useSearch(
    reservasData,
    searchTerm
  );

  return (
    <div className="financeiro">
      <div className="header-pages">
        <h2>Financeiro</h2>
        <div className="header-actions">
          <CreateButtonFinanceiro />
        </div>
      </div>
      {fetchErrorFinanceiro && <p className="error">{fetchErrorFinanceiro}</p>}
      {fetchErrorReservas && <p className="error">{fetchErrorReservas}</p>}
      <div className="loading">
        {isPendingFinanceiro && isPendingReservas && <p>Carregando...</p>}
      </div>
      <div className="controls-row">
        <div className="order-by">
          <p>Ordenar por: </p>
        </div>
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>
      <div className="search">
        <Search value={searchTerm} onChange={setSearchTerm} />
      </div>
      {(financeiroData || reservasData) && (
        <div className="financeiro">
          {viewMode === "cards" ? (
            <div className="financeiro-cards">
              {filteredFinanceiro.map((financeiro) => (
                <FinanceiroCard
                  key={financeiro.id}
                  financeiro={financeiro}
                  onDelete={handleDeleteFinanceiro}
                />
              ))}
              {filteredReservas.map((reserva) => (
                <FinanceiroReservasCard
                  key={reserva.id}
                  reserva={reserva}
                  onDelete={handleDeleteReservas}
                />
              ))}
            </div>
          ) : (
            <div className="financeiro-list">
              {filteredFinanceiro.map((financeiro) => (
                <FinanceiroList
                  key={financeiro.id}
                  financeiro={financeiro}
                  onDelete={handleDeleteFinanceiro}
                />
              ))}
              {filteredReservas.map((reserva) => (
                <FinanceiroReservasList
                  key={reserva.id}
                  reserva={reserva}
                  onDelete={handleDeleteReservas}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Financeiro;
