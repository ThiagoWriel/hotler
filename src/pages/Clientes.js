//components
import { ClientesCard } from "../components/Card";
import { CreateButtonCliente } from "../components/Botton";
import useFetch from "../components/useFetch";

const Clientes = () => {
  const { isPending, fetchError, hotler, handleDelete, setOrderBy } =
    useFetch("clientes");

  return (
    <div className="page clientes">
      <div className="header-pages">
        <h2>Clientes</h2>
        <CreateButtonCliente />
      </div>
      {fetchError && <p>{fetchError}</p>}
      <div className="loading">{isPending && <p>Carregando...</p>}</div>
      {hotler && (
        <div className="clientes">
          <div className="order-by">
            <p>Ordenar por: </p>
            <button onClick={() => setOrderBy("nome")}>Nome</button>
            <button onClick={() => setOrderBy("cpf")}>CPF</button>
            <button onClick={() => setOrderBy("telefone")}>Telefone</button>
            <button onClick={() => setOrderBy("nascimento")}>Nascimento</button>
            <button onClick={() => setOrderBy("obs")}>Observações</button>
          </div>
          <div className="clientes-cards">
            {hotler.map((cliente) => (
              <ClientesCard
                key={cliente.id}
                cliente={cliente}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
