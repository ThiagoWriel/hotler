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

  const {
    isPending: isPendingFinanceiro,
    fetchError: fetchErrorFinanceiro,
    hotler: financeiro,
    handleDelete: handleDeleteFinanceiro,
    setOrderBy: setOrderByFinanceiro,
  } = useFetch("financeiro");

  const isPending =
    isPendingQuartos ||
    isPendingClientes ||
    isPendingReservas ||
    isPendingFinanceiro;
  const fetchError =
    fetchErrorQuartos ||
    fetchErrorClientes ||
    fetchErrorReservas ||
    fetchErrorFinanceiro;

  return (
    <div className="dashboard">
      <div className="header-pages">
        <h2>Dashboard</h2>
      </div>
      <div className="loading">{isPending && <p>Carregando...</p>}</div>
      {fetchError && <p className="error">{fetchError}</p>}
      {quartos && clientes && reservas && financeiro && (
        <div className="dashboard">
          <div className="dashboard-cards">
            <DashboardCard
              dashboard={{
                title: "Quartos",
                value: quartos.length,
                icon: "hotel",
              }}
            />
            <DashboardCard
              dashboard={{
                title: "Hóspedes",
                value: clientes.length,
                icon: "person",
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
                title: "Receita",
                value:
                  "R$ " +
                  (financeiro.reduce(
                    (acc, item) =>
                      item.tipo_transacao === "Entrada"
                        ? acc + item.valor
                        : acc - item.valor,
                    0
                  ) +
                    reservas.reduce((acc, item) => acc + item.preco, 0)) +
                  ",00",
                icon: "attach_money",
              }}
            />
            <DashboardCard
              dashboard={{
                title: "Check-in Hoje",
                value: reservas.filter(
                  (reserva) =>
                    reserva.checkin === new Date().toISOString().split("T")[0]
                ).length,
                icon: "event_note",
              }}
            />
            <DashboardCard
              dashboard={{
                title: "Check-out Hoje",
                value: reservas.filter(
                  (reserva) =>
                    reserva.checkout === new Date().toISOString().split("T")[0]
                ).length,
                icon: "event_note",
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
