"use client";
import { useState } from "react";

//components
import { ClientesCard } from "../../components/Card";
import { ClientesList } from "../../components/List";
import { CreateButtonCliente } from "../../components/Botton";
import Search from "../../components/Search";
import ViewToggle from "../../components/ViewToggle";
import useFetch from "../../hooks/useFetch";
import useSearch from "../../hooks/useSearch";

const Clientes = () => {
  const { isPending, fetchError, hotler, handleDelete, setOrderBy } =
    useFetch("clientes");

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards");

  const { filteredData } = useSearch(hotler, searchTerm);

  return (
    <div className="clientes">
      <div className="header-pages">
        <h2>Clientes</h2>
        <CreateButtonCliente />
      </div>
      {fetchError && <p className="error">{fetchError}</p>}
      <div className="loading">{isPending && <p>Carregando...</p>}</div>
      {hotler && (
        <div className="clientes">
          <div className="controls-row">
            <div className="order-by">
              <p>Ordenar por: </p>
              <button onClick={() => setOrderBy("nome")}>Nome</button>
              <button onClick={() => setOrderBy("cpf")}>CPF</button>
              <button onClick={() => setOrderBy("telefone")}>Telefone</button>
            </div>
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
          <div className="search">
            <Search value={searchTerm} onChange={setSearchTerm} />
          </div>

          {viewMode === "cards" ? (
            <div className="clientes-cards">
              {filteredData.map((cliente) => (
                <ClientesCard
                  key={cliente.id}
                  cliente={cliente}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="clientes-list">
              {filteredData.map((cliente) => (
                <ClientesList
                  key={cliente.id}
                  cliente={cliente}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Clientes;
