"use client";
import useFetch from "../../components/useFetch";
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
      {isPending && <p>Carregando...</p>}
      {fetchError && <p className="error">{fetchError}</p>}
      {quartos && clientes && reservas && financeiro && (
        <div className="dashboard">
          <div className="dashboard-cards-quartos">
            <DashboardCard
              dashboard={{ title: "Quartos", value: quartos.length }}
            />
            <div className="dashboard-card-clientes">
              <h2>Clientes</h2>
              <p>{clientes.length}</p>
            </div>
            <div className="dashboard-card-reservas">
              <h2>Reservas</h2>
              <p>{reservas.length}</p>
            </div>
            <div className="dashboard-card-financeiro">
              <h2>Financeiro</h2>
              <p>{financeiro.length}</p>
            </div>
          </div>
          <div className="reservas">
            <h2>Reservas</h2>
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
