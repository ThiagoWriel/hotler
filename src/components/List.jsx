import Link from "next/link";
import supabase from "../config/supabaseClient";
import { formatCPF, formatTelefone, capitalize, formatDate } from "./Forms";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
          <span className="list-title">{capitalize(quarto.tipo)}</span>
          <span className="list-subtitle">Quarto {quarto.numero}</span>
        </div>
      </div>

      <div className="list-data">
        <div className="list-data-item">
          <i className="material-icons">cleaning_services</i>
          <span>{capitalize(quarto.estado)}</span>
        </div>
        <div className="list-data-item">
          <i className="material-icons">person</i>
          <span>{capitalize(quarto.ocupado)}</span>
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
          <span className="list-title">{capitalize(cliente.nome)}</span>
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
          <span>{formatDate(cliente.nascimento)}</span>
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

export const ReservasList = ({ reserva, onDelete, onCheckout }) => {
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

  const handleCheckout = async () => {
    // 1. Atualizar quarto para sujo e não ocupado
    const { error: quartoError } = await supabase
      .from("quartos")
      .update({ estado: "sujo", ocupado: "não" })
      .eq("id", reserva.quarto_id);

    if (quartoError) {
      console.log("Erro ao atualizar quarto:", quartoError);
      return;
    }

    // 2. Atualizar reserva para Finalizada
    const { error: reservaError } = await supabase
      .from("reservas")
      .update({ estado_reserva: "Finalizada" })
      .eq("id", reserva.id);

    if (reservaError) {
      console.log("Erro ao finalizar reserva:", reservaError);
      return;
    }

    // 3. Callback para atualizar UI
    if (onCheckout) {
      onCheckout(reserva.id, reserva.quarto_id);
    }
  };

  return (
    <div className="reservas-list-item">
      <div className="list-info">
        <div className="list-icon-container">
          <i className="material-icons">event_note</i>
        </div>
        <div className="list-details">
          <span className="list-title">
            {capitalize(reserva.clientes?.nome || "N/A")}
          </span>
          <span className="list-subtitle">
            Quarto {reserva.quartos?.numero || "N/A"}
          </span>
        </div>
      </div>

      <div className="list-data">
        <div className="list-data-item">
          <i className="material-icons">login</i>
          <span>{formatDate(reserva.checkin)}</span>
        </div>
        <div className="list-data-item">
          <i className="material-icons">logout</i>
          <span>{formatDate(reserva.checkout)}</span>
        </div>
        <div className="list-data-item">
          <i className="material-icons">info</i>
          <span>{capitalize(reserva.estado_reserva)}</span>
        </div>
      </div>

      <div className="list-actions">
        {onCheckout && reserva.estado_reserva === "Confirmada" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <i className="material-icons" title="Checkout rápido">
                logout
              </i>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Checkout</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja realizar o checkout desta reserva? O
                  quarto ficará marcado como sujo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleCheckout}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
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

export const QuartosSujosList = ({ quarto, onClean }) => {
  const handleClean = async () => {
    // Atualizar quarto para limpo
    const { error } = await supabase
      .from("quartos")
      .update({ estado: "limpo" })
      .eq("id", quarto.id);

    if (error) {
      console.log("Erro ao limpar quarto:", error);
      return;
    }

    // Callback para atualizar UI
    if (onClean) {
      onClean(quarto.id);
    }
  };

  return (
    <div className="quartos-list-item">
      <div className="list-info">
        <div className="list-icon-container">
          <i className="material-icons">hotel</i>
        </div>
        <div className="list-details">
          <span className="list-title">{capitalize(quarto.tipo)}</span>
          <span className="list-subtitle">Quarto {quarto.numero}</span>
        </div>
      </div>

      <div className="list-data">
        <div className="list-data-item">
          <i className="material-icons">cleaning_services</i>
          <span>{capitalize(quarto.estado)}</span>
        </div>
        <div className="list-data-item">
          <i className="material-icons">person</i>
          <span>{capitalize(quarto.ocupado)}</span>
        </div>
      </div>

      <div className="list-actions">
        <i
          className="material-icons"
          onClick={handleClean}
          title="Marcar como limpo"
        >
          cleaning_services
        </i>
        <Link href={"/update-quarto/" + quarto.id}>
          <i className="material-icons">edit</i>
        </Link>
      </div>
    </div>
  );
};

export const FinanceiroList = ({ financeiro, onDelete }) => {
  const handleDelete = async () => {
    // Bloqueia exclusão se for entrada de reserva
    if (financeiro.reserva_id) {
      alert(
        "Esta entrada é de uma reserva. Para excluir, delete a reserva na página de Reservas.",
      );
      return;
    }

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
          <span className="list-title">{capitalize(financeiro.origem)}</span>
          <span className="list-subtitle list-price">
            R$ {financeiro.valor},00
          </span>
        </div>
      </div>

      <div className="list-data">
        <div className="list-data-item">
          <i className="material-icons">calendar_today</i>
          <span>{formatDate(financeiro.data_transacao)}</span>
        </div>
        <div className="list-data-item">
          <i className="material-icons">payments</i>
          <span>{capitalize(financeiro.metodo)}</span>
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
