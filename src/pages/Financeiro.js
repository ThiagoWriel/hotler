import { CreateButtonFinanceiro } from "../components/Botton";
import { FinanceiroCard, FinanceiroReservasCard } from "../components/Card";
import useFetch from "../components/useFetch";

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

  return (
    <div className="page financeiro">
      <div className="header-pages">
        <h2>Financeiro</h2>
        <CreateButtonFinanceiro />
      </div>
      {fetchErrorFinanceiro && <p>{fetchErrorFinanceiro}</p>}
      {fetchErrorReservas && <p>{fetchErrorReservas}</p>}
      <div className="loading">
        {(isPendingFinanceiro || isPendingReservas) && <p>Carregando...</p>}
      </div>
      {financeiroData && (
        <div className="financeiro">
          <div className="financeiro-cards">
            {financeiroData.map((financeiro) => (
              <FinanceiroCard
                key={financeiro.id}
                financeiro={financeiro}
                onDelete={handleDeleteFinanceiro}
              />
            ))}
            {reservasData &&
              reservasData.map((reserva) => (
                <FinanceiroReservasCard
                  key={reserva.id}
                  reserva={reserva}
                  onDelete={handleDeleteReservas}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Financeiro;
