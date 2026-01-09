import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";

//components
import { ClientesCard } from "../components/Card";
import { CreateButtonCliente } from "../components/Botton";

const Clientes = () => {
  const [fetchError, setFetchError] = useState(null);
  const [hotler, setHotler] = useState(null);
  const [orderBy, setOrderBy] = useState("nome");

  const handleDeleteCliente = (id) => {
    setHotler((prevHotler) => {
      return prevHotler.filter((c) => c.id !== id);
    });
  };

  useEffect(() => {
    const fetchHotler = async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select()
        .order(orderBy, { ascending: true });

      if (error) {
        setFetchError("Nao conseguiu acessar os dados dos clientes");
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
    <div className="page clientes">
      <div className="header-pages">
        <h2>Clientes</h2>
        <CreateButtonCliente />
      </div>
      {fetchError && <p>{fetchError}</p>}
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
                onDelete={handleDeleteCliente}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
