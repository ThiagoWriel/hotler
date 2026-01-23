"use client";
import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { DashboardCards } from "../../components/DashboardCards";
import {
  CreateButtonReserva,
  CreateButtonCliente,
} from "../../components/Botton";
import { DashboardTabs } from "../../components/DashboardTabs";

export default function Dashboard() {
  const {
    isPending: isPendingQuartos,
    fetchError: fetchErrorQuartos,
    hotler: quartosData,
    handleDelete: handleDeleteQuarto,
  } = useFetch("quartos");

  const {
    isPending: isPendingClientes,
    fetchError: fetchErrorClientes,
    hotler: clientes,
  } = useFetch("clientes");

  const {
    isPending: isPendingReservas,
    fetchError: fetchErrorReservas,
    hotler: reservasData,
    handleDelete: handleDeleteReserva,
  } = useFetch("reservas");

  // Estado local para atualizações em tempo real
  const [quartos, setQuartos] = useState(null);
  const [reservas, setReservas] = useState(null);

  // Sincronizar estados locais com dados do fetch
  useEffect(() => {
    if (quartosData) setQuartos(quartosData);
  }, [quartosData]);

  useEffect(() => {
    if (reservasData) setReservas(reservasData);
  }, [reservasData]);

  const isPending = isPendingQuartos || isPendingClientes || isPendingReservas;
  const fetchError =
    fetchErrorQuartos || fetchErrorClientes || fetchErrorReservas;

  // Handler para checkout rápido
  const handleCheckout = (reservaId, quartoId) => {
    // Atualizar reserva para Finalizada
    setReservas((prev) =>
      prev.map((r) =>
        r.id === reservaId ? { ...r, estado_reserva: "Finalizada" } : r,
      ),
    );
    // Atualizar quarto para sujo
    setQuartos((prev) =>
      prev.map((q) =>
        q.id === quartoId ? { ...q, estado: "sujo", ocupado: "não" } : q,
      ),
    );
  };

  // Handler para limpar quarto
  const handleCleanRoom = (quartoId) => {
    setQuartos((prev) =>
      prev.map((q) => (q.id === quartoId ? { ...q, estado: "limpo" } : q)),
    );
  };

  // Handler para delete de quarto (atualiza estado local)
  const handleQuartoDelete = (id) => {
    handleDeleteQuarto(id);
    setQuartos((prev) => prev.filter((q) => q.id !== id));
  };

  // Handler para delete de reserva (atualiza estado local)
  const handleReservaDelete = (id) => {
    handleDeleteReserva(id);
    setReservas((prev) => prev.filter((r) => r.id !== id));
  };

  // Handler para pagamento (atualiza estado local)
  const handlePagou = (reservaId) => {
    setReservas((prev) =>
      prev.map((r) =>
        r.id === reservaId ? { ...r, pagamento_realizado: "Sim" } : r,
      ),
    );
  };

  return (
    <div className="dashboard">
      <div className="header-pages">
        <h2>Início</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <CreateButtonCliente />
          <CreateButtonReserva />
        </div>
      </div>
      <div className="loading">{isPending && <p>Carregando...</p>}</div>
      {fetchError && <p className="error">{fetchError}</p>}
      {quartos && clientes && reservas && (
        <div className="dashboard">
          <DashboardCards quartos={quartos} reservas={reservas} />

          <DashboardTabs
            quartos={quartos}
            reservas={reservas}
            onDeleteQuarto={handleQuartoDelete}
            onDeleteReserva={handleReservaDelete}
            onCheckout={handleCheckout}
            onCleanRoom={handleCleanRoom}
            onPagou={handlePagou}
          />
        </div>
      )}
    </div>
  );
}
