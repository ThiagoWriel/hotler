import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";

export const QuartosCard = ({ quarto, onDelete }) => {
  const handleDelete = async () => {
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
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
      </div>
    </div>
  );
};

export const ClientesCard = ({ cliente, onDelete }) => {
  const handleDelete = async () => {
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
      <div className="buttons">
        <Link to={"/update-cliente/" + cliente.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
      </div>
    </div>
  );
};

export const ReservasCard = ({ reserva, onDelete }) => {
  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("reservas")
      .delete()
      .eq("id", reserva.id)
      .select();

    if (error) {
      console.log(error);
    }
    if (data) {
      onDelete(reserva.id);
    }
  };
  return (
    <div className="reservas-card">
      <h3>{reserva.cliente_reserva}</h3>
      <div className="numero">
        <p>{reserva.quarto_reserva}</p>
      </div>
      <p>{reserva.checkin}</p>
      <p>{reserva.checkout}</p>
      <p>{reserva.estado_reserva}</p>
      <div className="buttons">
        <Link to={"/update-reserva/" + reserva.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
      </div>
    </div>
  );
};

export const FinanceiroCard = ({ financeiro, onDelete }) => {
  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("financeiro")
      .delete()
      .eq("id", financeiro.id)
      .select();

    if (error) {
      console.log(error);
    }
    if (data) {
      onDelete(financeiro.id);
    }
  };
  return (
    <div className="financeiro-card">
      <h3> {financeiro.origem}</h3>
      <h3> R$ {financeiro.valor},00</h3>
      <p>{financeiro.data_transacao}</p>
      <p>{financeiro.metodo}</p>
      <div className="buttons">
        <Link to={"/update-financeiro/" + financeiro.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
      </div>
    </div>
  );
};

export const FinanceiroReservasCard = ({ reserva, onDelete }) => {
  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("reservas")
      .delete()
      .eq("id", reserva.id)
      .select();

    if (error) {
      console.log(error);
    }
    if (data) {
      onDelete(reserva.id);
    }
  };
  return (
    <div className="financeiro-card">
      <h3>Reserva</h3>
      <h3>R$ {reserva.preco},00</h3>
      <p>{reserva.checkout}</p>
      <p>{reserva.tipo_pagamento}</p>
      <div className="buttons">
        <Link to={"/update-reserva/" + reserva.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
      </div>
    </div>
  );
};
