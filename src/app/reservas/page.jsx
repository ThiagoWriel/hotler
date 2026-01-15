"use client";

//components
import { ReservasCard } from "../../components/Card";
import { CreateButtonReserva } from "../../components/Botton";
import useFetch from "../../components/useFetch";

const Reservas = () => {
  const { isPending, fetchError, hotler, handleDelete } = useFetch("reservas");

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
          <div className="reservas-cards">
            {hotler.map((reserva) => (
              <ReservasCard
                key={reserva.id}
                reserva={reserva}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservas;
