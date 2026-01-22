"use client";
import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { DashboardCard } from "../../components/Card";
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

  // Calculos Dashboard
  const pessoasHospedadas = reservas
    ? reservas
        .filter((r) => r.estado_reserva === "Confirmada")
        .reduce((acc, r) => acc + (parseInt(r.pessoas) || 0), 0)
    : 0;

  const pagamentos_nao_realizados = reservas
    ? reservas.filter((r) => r.pagamento_realizado === "Não").length
    : 0;

  const quartosDisponiveis = quartos
    ? quartos.filter((q) => q.estado === "limpo" && q.ocupado === "não").length
    : 0;

  const quartosSujos = quartos
    ? quartos.filter((q) => q.estado === "sujo" && q.ocupado === "sim").length
    : 0;

  const quartosOcupados = quartos
    ? quartos.filter((q) => q.estado === "limpo" && q.ocupado === "sim").length
    : 0;

  const totalQuartos = quartos ? quartos.length : 0;
  const ocupacao =
    totalQuartos > 0
      ? ((totalQuartos - quartosDisponiveis) / totalQuartos) * 100
      : 0;

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
          <div className="dashboard-cards">
            <DashboardCard
              dashboard={{
                title: "Ocupação",
                value: ocupacao.toFixed(0) + "%",
                icon: "pie_chart",
              }}
            />
            <DashboardCard
              dashboard={{
                title: "Quartos Ocupados",
                value: quartosOcupados,
                icon: "meeting_room",
              }}
            />
            <DashboardCard
              dashboard={{
                title: "Quartos Disponíveis",
                value: quartosDisponiveis,
                icon: "meeting_room",
              }}
            />
            <DashboardCard
              dashboard={{
                title: "Quartos Sujos",
                value: quartosSujos,
                icon: "cleaning_services",
              }}
            />
            <DashboardCard
              dashboard={{
                title: "Pessoas Hospedadas",
                value: pessoasHospedadas,
                icon: "groups",
              }}
            />
            <DashboardCard
              dashboard={{
                title: "Reservas Ativas",
                value: reservas.length,
                icon: "event_note",
              }}
            />
            <DashboardCard
              dashboard={{
                title: "Pagamentos a receber",
                value: pagamentos_nao_realizados,
                icon: "payment",
              }}
            />
            <DashboardCard
              dashboard={{
                title: "Check-in Hoje",
                value: reservas.filter(
                  (reserva) =>
                    reserva.checkin === new Date().toISOString().split("T")[0],
                ).length,
                icon: "login",
              }}
            />
            <DashboardCard
              dashboard={{
                title: "Check-out Hoje",
                value: reservas.filter(
                  (reserva) =>
                    reserva.checkout === new Date().toISOString().split("T")[0],
                ).length,
                icon: "logout",
              }}
            />
          </div>

          <DashboardTabs
            quartos={quartos}
            reservas={reservas}
            onDeleteQuarto={handleQuartoDelete}
            onDeleteReserva={handleReservaDelete}
            onCheckout={handleCheckout}
            onCleanRoom={handleCleanRoom}
          />
        </div>
      )}
    </div>
  );
}
