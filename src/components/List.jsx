import Link from "next/link";
import supabase from "../config/supabaseClient";
import { formatCPF, formatTelefone } from "./Forms";

export const QuartosList = ({ quarto, onDelete, reservas }) => {
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
    <div className="quartos-list-item">
      <div className="list-info">
        <div className="list-icon-container">
          <i className="material-icons">hotel</i>
        </div>
        <div className="list-details">
          <span className="list-title">{quarto.tipo}</span>
          <span className="list-subtitle">Quarto {quarto.numero}</span>
        </div>
      </div>

      <div className="list-data">
        <div className="list-data-item">
          <i className="material-icons">cleaning_services</i>
          <span>{quarto.estado}</span>
        </div>
        <div className="list-data-item">
          <i className="material-icons">person</i>
          <span>{quarto.ocupado}</span>
        </div>
      </div>

      <div className="list-actions">
        <Link href={"/update-quarto/" + quarto.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
      </div>
    </div>
  );
};

export const ClientesList = ({ cliente, onDelete }) => {
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
    <div className="clientes-list-item">
      <div className="list-info">
        <div className="list-icon-container">
          <i className="material-icons">person</i>
        </div>
        <div className="list-details">
          <span className="list-title">{cliente.nome}</span>
          <span className="list-subtitle">
            CPF: {formatCPF(String(cliente.cpf || ""))}
          </span>
        </div>
      </div>

      <div className="list-data">
        <div className="list-data-item">
          <i className="material-icons">phone</i>
          <span>{formatTelefone(String(cliente.telefone || ""))}</span>
        </div>
        <div className="list-data-item">
          <i className="material-icons">cake</i>
          <span>{cliente.nascimento}</span>
        </div>
      </div>

      <div className="list-actions">
        <Link href={"/update-cliente/" + cliente.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
      </div>
    </div>
  );
};

export const ReservasList = ({ reserva, onDelete }) => {
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
    <div className="reservas-list-item">
      <div className="list-info">
        <div className="list-icon-container">
          <i className="material-icons">event_note</i>
        </div>
        <div className="list-details">
          <span className="list-title">{reserva.clientes?.nome || "N/A"}</span>
          <span className="list-subtitle">
            Quarto {reserva.quartos?.numero || "N/A"}
          </span>
        </div>
      </div>

      <div className="list-data">
        <div className="list-data-item">
          <i className="material-icons">login</i>
          <span>{reserva.checkin}</span>
        </div>
        <div className="list-data-item">
          <i className="material-icons">logout</i>
          <span>{reserva.checkout}</span>
        </div>
        <div className="list-data-item">
          <i className="material-icons">info</i>
          <span>{reserva.estado_reserva}</span>
        </div>
      </div>

      <div className="list-actions">
        <Link href={"/update-reserva/" + reserva.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
      </div>
    </div>
  );
};

export const FinanceiroList = ({ financeiro, onDelete }) => {
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
    <div className="financeiro-list-item">
      <div className="list-info">
        <div className="list-icon-container">
          <i className="material-icons">attach_money</i>
        </div>
        <div className="list-details">
          <span className="list-title">{financeiro.origem}</span>
          <span className="list-subtitle list-price">
            R$ {financeiro.valor},00
          </span>
        </div>
      </div>

      <div className="list-data">
        <div className="list-data-item">
          <i className="material-icons">calendar_today</i>
          <span>{financeiro.data_transacao}</span>
        </div>
        <div className="list-data-item">
          <i className="material-icons">payments</i>
          <span>{financeiro.metodo}</span>
        </div>
      </div>

      <div className="list-actions">
        <Link href={"/update-financeiro/" + financeiro.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
      </div>
    </div>
  );
};

export const FinanceiroReservasList = ({ reserva, onDelete }) => {
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
    <div className="financeiro-list-item">
      <div className="list-info">
        <div className="list-icon-container">
          <i className="material-icons">book_online</i>
        </div>
        <div className="list-details">
          <span className="list-title">Reserva</span>
          <span className="list-subtitle list-price">
            R$ {reserva.preco},00
          </span>
        </div>
      </div>

      <div className="list-data">
        <div className="list-data-item">
          <i className="material-icons">event</i>
          <span>{reserva.checkout}</span>
        </div>
        <div className="list-data-item">
          <i className="material-icons">payments</i>
          <span>{reserva.tipo_pagamento}</span>
        </div>
      </div>

      <div className="list-actions">
        <Link href={"/update-reserva/" + reserva.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
      </div>
    </div>
  );
};
