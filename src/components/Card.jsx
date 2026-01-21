import Link from "next/link";
import supabase from "../config/supabaseClient";
import { formatCPF, formatTelefone } from "./Forms";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <Card className="quartos-card relative">
      <CardHeader>
        <div className="flex items-center gap-3">
          <i className="material-icons card-icon">hotel</i>
          <CardTitle>{quarto.tipo}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="card-row">
          <i className="material-icons">cleaning_services</i>
          <Badge
            variant={
              quarto.estado === ("limpo" || "Limpo") ? "success" : "destructive"
            }
          >
            {quarto.estado}
          </Badge>
        </div>
        <div className="card-row">
          <i className="material-icons">person</i>
          <Badge variant={quarto.ocupado === "sim" ? "default" : "secondary"}>
            {quarto.ocupado}
          </Badge>
        </div>
      </CardContent>

      <div className="numero">
        <p>{quarto.numero}</p>
      </div>

      <CardFooter className="buttons">
        <Link href={"/update-quarto/" + quarto.id}>
          <Button variant="outline" size="icon" className="rounded-full">
            <i className="material-icons">edit</i>
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={handleDelete}
        >
          <i className="material-icons">delete</i>
        </Button>
      </CardFooter>
    </Card>
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
    <Card className="clientes-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <i className="material-icons card-icon">person</i>
          <CardTitle>{cliente.nome}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
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
      </CardContent>

      <CardFooter className="buttons">
        <Link href={"/update-cliente/" + cliente.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
      </CardFooter>
    </Card>
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
    <Card className="reservas-card relative">
      <CardHeader>
        <div className="flex items-center gap-3">
          <i className="material-icons card-icon">event_note</i>
          <CardTitle>{reserva.clientes?.nome || "N/A"}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
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
          <Badge
            variant={
              reserva.estado_reserva === "Confirmada"
                ? "success"
                : reserva.estado_reserva === "Cancelada"
                  ? "destructive"
                  : "warning"
            }
          >
            {reserva.estado_reserva}
          </Badge>
        </div>
      </CardContent>

      <div className="numero">
        <p>{reserva.quartos?.numero || "N/A"}</p>
      </div>

      <CardFooter className="buttons">
        <Link href={"/update-reserva/" + reserva.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
      </CardFooter>
    </Card>
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
    <Card className="financeiro-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <i className="material-icons card-icon">attach_money</i>
          <CardTitle>{financeiro.origem}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="card-row price-row">
          <span>R$ {financeiro.valor},00</span>
        </div>
        <div className="card-row">
          <i className="material-icons">swap_horiz</i>
          <Badge
            variant={
              financeiro.tipo_transacao === "Entrada"
                ? "success"
                : "destructive"
            }
          >
            {financeiro.tipo_transacao}
          </Badge>
        </div>
        <div className="card-row">
          <i className="material-icons">calendar_today</i>
          <span>{financeiro.data_transacao}</span>
        </div>
        <div className="card-row">
          <i className="material-icons">payments</i>
          <span>{financeiro.metodo}</span>
        </div>
      </CardContent>

      <CardFooter className="buttons">
        <Link href={"/update-financeiro/" + financeiro.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
      </CardFooter>
    </Card>
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
    <Card className="financeiro-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <i className="material-icons card-icon">book_online</i>
          <CardTitle>Reserva</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
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
      </CardContent>

      <CardFooter className="buttons">
        <Link href={"/update-reserva/" + reserva.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
      </CardFooter>
    </Card>
  );
};

export const DashboardCard = ({ dashboard }) => {
  return (
    <Card className="dashboard-card">
      <CardContent className="dashboard-card-content">
        <div className="dashboard-card-info">
          <span className="dashboard-card-label">{dashboard.title}</span>
          <h3 className="dashboard-card-value">{dashboard.value}</h3>
        </div>
        <div className="dashboard-card-icon-container">
          <i className="material-icons dashboard-card-icon">{dashboard.icon}</i>
        </div>
      </CardContent>
    </Card>
  );
};
