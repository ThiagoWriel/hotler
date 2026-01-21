"use client";
import useFetch from "../../hooks/useFetch";
import { ReservasCard } from "../../components/Card";
import { DashboardCard } from "../../components/Card";

export default function Dashboard() {
  const {
    isPending: isPendingQuartos,
    fetchError: fetchErrorQuartos,
    hotler: quartos,
    handleDelete: handleDeleteQuarto,
    setOrderBy: setOrderByQuarto,
  } = useFetch("quartos");

  const {
    isPending: isPendingClientes,
    fetchError: fetchErrorClientes,
    hotler: clientes,
    handleDelete: handleDeleteCliente,
    setOrderBy: setOrderByCliente,
  } = useFetch("clientes");

  const {
    isPending: isPendingReservas,
    fetchError: fetchErrorReservas,
    hotler: reservas,
    handleDelete: handleDeleteReserva,
    setOrderBy: setOrderByReserva,
  } = useFetch("reservas");

  const isPending = isPendingQuartos || isPendingClientes || isPendingReservas;
  const fetchError =
    fetchErrorQuartos || fetchErrorClientes || fetchErrorReservas;

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
        <h2>Dashboard</h2>
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
          <br />
          <hr />
          <div className="reservas">
            <div className="reservas-cards">
              {reservas.map((reserva) => (
                <ReservasCard
                  key={reserva.id}
                  reserva={reserva}
                  onDelete={handleDeleteReserva}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
