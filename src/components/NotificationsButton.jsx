"use client";
import { useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { createClient } from "@/lib/supabase/client";
import { formatDate, capitalize } from "./Forms";

export const NotificationsButton = ({ reservas, onCheckout }) => {
  const [open, setOpen] = useState(false);

  // Data de hoje para comparação
  const hoje = new Date().toISOString().split("T")[0];

  // Filtrar check-outs pendentes (checkout já passou e reserva não finalizada)
  const checkoutsPendentes = reservas
    ? reservas.filter(
        (r) => r.estado_reserva !== "Finalizada" && r.checkout < hoje,
      )
    : [];

  const handleCheckout = async (reserva) => {
    const supabase = createClient();
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="notifications-button">
          <Bell className="h-5 w-5" />
          {checkoutsPendentes.length > 0 && (
            <span className="notifications-badge">
              {checkoutsPendentes.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="notifications-dialog">
        <DialogHeader>
          <DialogTitle>Notificações</DialogTitle>
        </DialogHeader>

        <div className="notifications-content">
          {/* Seção: Check-outs Pendentes */}
          <div className="notifications-section">
            <h4 className="notifications-section-title">
              <i className="material-icons">logout</i>
              Check-outs Pendentes
            </h4>

            {checkoutsPendentes.length > 0 ? (
              <div className="notifications-list">
                {checkoutsPendentes.map((reserva) => (
                  <div key={reserva.id} className="notifications-item">
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
                      <div className="list-data-item notifications-date-warning">
                        <i className="material-icons">warning</i>
                        <span>Checkout: {formatDate(reserva.checkout)}</span>
                      </div>
                    </div>

                    <div className="list-actions">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <i className="material-icons" title="Checkout rápido">
                            logout
                          </i>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirmar Checkout
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja realizar o checkout desta
                              reserva? O quarto ficará marcado como sujo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCheckout(reserva)}
                            >
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Link href={"/update-reserva/" + reserva.id}>
                        <i className="material-icons" title="Prolongar reserva">
                          edit_calendar
                        </i>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="notifications-empty">
                <i className="material-icons">check_circle</i>
                Nenhum check-out pendente
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
