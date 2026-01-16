import Link from "next/link";
import supabase from "../config/supabaseClient";
import { formatCPF, formatTelefone } from "./Forms";

export const QuartosCard = ({ quarto, onDelete, reservas }) => {
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
      <div className="card-header">
        <i className="material-icons card-icon">hotel</i>
        <h3>{quarto.tipo}</h3>
      </div>

      <div className="card-body">
        <div className="card-row">
          <i className="material-icons">cleaning_services</i>
          <span>{quarto.estado}</span>
        </div>
        <div className="card-row">
          <i className="material-icons">person</i>
          <span>{quarto.ocupado}</span>
        </div>
      </div>

      <div className="numero">
        <p>{quarto.numero}</p>
      </div>
      <div className="buttons">
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
      <div className="card-header">
        <i className="material-icons card-icon">person</i>
        <h3>{cliente.nome}</h3>
      </div>

      <div className="card-body">
        <div className="card-row">
          <i className="material-icons">badge</i>
          <span>CPF: {formatCPF(String(cliente.cpf || ""))}</span>
        </div>
        <div className="card-row">
          <i className="material-icons">phone</i>
          <span>{formatTelefone(String(cliente.telefone || ""))}</span>
        </div>
        <div className="card-row">
          <i className="material-icons">cake</i>
          <span>{cliente.nascimento}</span>
        </div>
      </div>

      <div className="buttons">
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
      <div className="card-header">
        <i className="material-icons card-icon">event_note</i>
        <h3>{reserva.cliente_reserva}</h3>
      </div>

      <div className="card-body">
        <div className="card-row">
          <i className="material-icons">login</i>
          <span>Check-in: {reserva.checkin}</span>
        </div>
        <div className="card-row">
          <i className="material-icons">logout</i>
          <span>Check-out: {reserva.checkout}</span>
        </div>
        <div className="card-row">
          <i className="material-icons">info</i>
          <span>Status: {reserva.estado_reserva}</span>
        </div>
      </div>

      <div className="numero">
        <p>{reserva.quarto_reserva}</p>
      </div>

      <div className="buttons">
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
      <div className="card-header">
        <i className="material-icons card-icon">attach_money</i>
        <h3>{financeiro.origem}</h3>
      </div>

      <div className="card-body">
        <div className="card-row price-row">
          <span>R$ {financeiro.valor},00</span>
        </div>
        <div className="card-row">
          <i className="material-icons">calendar_today</i>
          <span>{financeiro.data_transacao}</span>
        </div>
        <div className="card-row">
          <i className="material-icons">payments</i>
          <span>{financeiro.metodo}</span>
        </div>
      </div>

      <div className="buttons">
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
      <div className="card-header">
        <i className="material-icons card-icon">book_online</i>
        <h3>Reserva</h3>
      </div>

      <div className="card-body">
        <div className="card-row price-row">
          <span>R$ {reserva.preco},00</span>
        </div>
        <div className="card-row">
          <i className="material-icons">event</i>
          <span>{reserva.checkout} (Checkout)</span>
        </div>
        <div className="card-row">
          <i className="material-icons">payments</i>
          <span>{reserva.tipo_pagamento}</span>
        </div>
      </div>

      <div className="buttons">
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

export const DashboardCard = ({ dashboard }) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-content">
        <div className="dashboard-card-info">
          <span className="dashboard-card-label">{dashboard.title}</span>
          <h3 className="dashboard-card-value">{dashboard.value}</h3>
        </div>
        <div className="dashboard-card-icon-container">
          <i className="material-icons dashboard-card-icon">{dashboard.icon}</i>
        </div>
      </div>
    </div>
  );
};
