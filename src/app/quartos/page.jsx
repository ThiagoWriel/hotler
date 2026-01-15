"use client";

//components
import { QuartosCard } from "../../components/Card";
import { CreateButtonQuarto } from "../../components/Botton";
import useFetch from "../../hooks/useFetch";

const Quartos = () => {
  const { isPending, fetchError, hotler, handleDelete, setOrderBy, orderBy } =
    useFetch("quartos");
  return (
    <div className="quartos">
      <div className="header-pages">
        <h2>Quartos</h2>
        <CreateButtonQuarto />
      </div>
      {fetchError && <p className="error">{fetchError}</p>}
      <div className="loading">{isPending && <p>Carregando...</p>}</div>
      {hotler && (
        <div className="quartos">
          <div className="order-by">
            <p>Ordenar por: </p>
            <button
              className={orderBy === "numero" ? "active" : ""}
              onClick={() => setOrderBy("numero")}
            >
              Numero
            </button>
            <button
              className={orderBy === "tipo" ? "active" : ""}
              onClick={() => setOrderBy("tipo")}
            >
              Tipo
            </button>
            <button
              className={orderBy === "estado" ? "active" : ""}
              onClick={() => setOrderBy("estado")}
            >
              Estado
            </button>
            <button
              className={orderBy === "ocupado" ? "active" : ""}
              onClick={() => setOrderBy("ocupado")}
            >
              Ocupado
            </button>
          </div>
          <div className="quartos-cards">
            {hotler.map((quarto) => (
              <QuartosCard
                key={quarto.id}
                quarto={quarto}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quartos;
