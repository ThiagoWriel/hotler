import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";

//components
import { ReservasCard } from "../components/Card";
import { CreateButtonReserva } from "../components/Botton";

const Reservas = () => {
  const [fetchError, setFetchError] = useState(null);
  const [hotler, setHotler] = useState(null);

  const handleDeleteReserva = (id) => {
    setHotler((prevHotler) => {
      return prevHotler.filter((q) => q.id !== id);
    });
  };

  useEffect(() => {
    const fetchHotler = async () => {
      const { data, error } = await supabase.from("reservas").select();

      if (error) {
        setFetchError("Nao conseguiu acessar os dados dos quartos");
        setHotler(null);
        console.log(error);
      }
      if (data) {
        setHotler(data);
        setFetchError(null);
      }
    };

    fetchHotler();
  });

  return (
    <div className="page reservas">
      <div className="header-pages">
        <h2>Reservas</h2>
        <CreateButtonReserva />
      </div>
      {fetchError && <p>{fetchError}</p>}
      {hotler && (
        <div className="reservas">
          <div className="reservas-cards">
            {hotler.map((reserva) => (
              <ReservasCard
                key={reserva.id}
                reserva={reserva}
                onDelete={handleDeleteReserva}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservas;
