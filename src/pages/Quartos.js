//components
import { QuartosCard } from "../components/Card";
import { CreateButtonQuarto } from "../components/Botton";
import useFetch from "../components/useFetch";

const Quartos = () => {
  const { isPending, fetchError, hotler, handleDelete, setOrderBy } =
    useFetch("quartos");
  return (
    <div className="page quartos">
      <div className="header-pages">
        <h2>Quartos</h2>
        <CreateButtonQuarto />
      </div>
      {fetchError && <p>{fetchError}</p>}
      <div className="loading">{isPending && <p>Carregando...</p>}</div>
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
