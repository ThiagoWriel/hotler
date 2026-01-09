import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";

//components
import { QuartosCard } from "../components/Card";
import { CreateButtonQuarto } from "../components/Botton";

const Quartos = () => {
  const [fetchError, setFetchError] = useState(null);
  const [hotler, setHotler] = useState(null);
  const [orderBy, setOrderBy] = useState("numero");

  const handleDeleteQuarto = (id) => {
    setHotler((prevHotler) => {
      return prevHotler.filter((q) => q.id !== id);
    });
  };

  useEffect(() => {
    const fetchHotler = async () => {
      const { data, error } = await supabase
        .from("quartos")
        .select()
        .order(orderBy, { ascending: true });

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
  }, [orderBy]);

  return (
    <div className="page quartos">
      <div className="header-pages">
        <h2>Quartos</h2>
        <CreateButtonQuarto />
      </div>
      {fetchError && <p>{fetchError}</p>}
      {hotler && (
        <div className="quartos">
          <div className="order-by">
            <p>Ordenar por: </p>
            <button onClick={() => setOrderBy("numero")}>Numero</button>
            <button onClick={() => setOrderBy("tipo")}>Tipo</button>
            <button onClick={() => setOrderBy("estado")}>Estado</button>
            <button onClick={() => setOrderBy("ocupado")}>Ocupado</button>
          </div>
          <div className="quartos-cards">
            {hotler.map((quarto) => (
              <QuartosCard
                key={quarto.id}
                quarto={quarto}
                onDelete={handleDeleteQuarto}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quartos;
