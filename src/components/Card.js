import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";

export const QuartosCard = ({ quarto, onDelete }) => {
  const handleDeleteQuarto = async () => {
    const { data, error } = await supabase
      .from("quartos")
      .delete()
      .eq("id", quarto.id)
      .select();

    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
      onDelete(quarto.id);
    }
  };

  return (
    <div className="quartos-card">
      <h3>{quarto.tipo}</h3>
      <p>{quarto.estado}</p>
      <p>{quarto.ocupado}</p>
      <div className="numero">
        <p>{quarto.numero}</p>
      </div>
      <div className="buttons">
        <Link to={"/update-quarto/" + quarto.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDeleteQuarto}>
          delete
        </i>
      </div>
    </div>
  );
};

export const ClientesCard = ({ cliente, onDelete }) => {
  const handleDeleteCliente = async () => {
    const { data, error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", cliente.id)
      .select();

    if (error) {
      console.log(error);
    }
    if (data) {
      onDelete(cliente.id);
    }
  };
  return (
    <div className="clientes-card">
      <h3>{cliente.nome}</h3>
      <p>{cliente.cpf}</p>
      <p>{cliente.telefone}</p>
      <p>{cliente.nascimento}</p>
      <p>{cliente.obs}</p>
      <div className="buttons">
        <Link to={"/update-cliente/" + cliente.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDeleteCliente}>
          delete
        </i>
      </div>
    </div>
  );
};
