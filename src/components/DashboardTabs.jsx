"use client";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "./ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { QuartosList } from "./List";
import { ReservasList } from "./List";

export const DashboardTabs = ({
  quartos,
  reservas,
  onDeleteQuarto,
  onDeleteReserva,
}) => {
  const [currentTab, setCurrentTab] = useState(1);
  const totalTabs = 5;

  // Data de hoje para filtros de check-in e check-out
  const hoje = new Date().toISOString().split("T")[0];

  // Filtrar quartos disponíveis (limpos e não ocupados)
  const quartosDisponiveis = quartos
    ? quartos.filter((q) => q.estado === "limpo" && q.ocupado === "não")
    : [];

  // Filtrar reservas ativas (confirmadas)
  const reservasAtivas = reservas
    ? reservas.filter((r) => r.estado_reserva === "Confirmada")
    : [];

  // Filtrar pagamentos a receber (pagamento não realizado)
  const pagamentosAReceber = reservas
    ? reservas.filter((r) => r.pagamento_realizado === "Não")
    : [];

  // Filtrar check-ins de hoje
  const checkInsHoje = reservas
    ? reservas.filter((r) => r.checkin === hoje)
    : [];

  // Filtrar check-outs de hoje
  const checkOutsHoje = reservas
    ? reservas.filter((r) => r.checkout === hoje)
    : [];

  const handleTabChange = (tab) => {
    if (tab >= 1 && tab <= totalTabs) {
      setCurrentTab(tab);
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    handleTabChange(currentTab - 1);
  };

  const handleNext = (e) => {
    e.preventDefault();
    handleTabChange(currentTab + 1);
  };

  return (
    <div className="dashboard-tabs">
      <div className="dashboard-tabs-header">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={handlePrevious}
                size="default"
                className={`pagination-nav ${currentTab === 1 ? "pagination-disabled" : ""}`}
              >
                <ChevronLeft className="pagination-icon" />
                <span>Anterior</span>
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={currentTab === 1}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={currentTab === 2}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange(2);
                }}
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={currentTab === 3}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange(3);
                }}
              >
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={currentTab === 4}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange(4);
                }}
              >
                4
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={currentTab === 5}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange(5);
                }}
              >
                5
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={handleNext}
                size="default"
                className={`pagination-nav ${currentTab === totalTabs ? "pagination-disabled" : ""}`}
              >
                <span>Próximo</span>
                <ChevronRight className="pagination-icon" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className="dashboard-tabs-content">
        {/* Aba 1 - Quartos Disponíveis */}
        {currentTab === 1 && (
          <div className="dashboard-tab-panel">
            <h3 className="dashboard-tabs-title">Quartos Disponíveis</h3>
            {quartosDisponiveis.length > 0 ? (
              <div className="dashboard-tabs-list">
                {quartosDisponiveis.map((quarto) => (
                  <QuartosList
                    key={quarto.id}
                    quarto={quarto}
                    onDelete={onDeleteQuarto}
                  />
                ))}
              </div>
            ) : (
              <p className="dashboard-tabs-empty">
                <i className="material-icons">info</i>
                Nenhum quarto disponível no momento
              </p>
            )}
          </div>
        )}

        {/* Aba 2 - Reservas Ativas */}
        {currentTab === 2 && (
          <div className="dashboard-tab-panel">
            <h3 className="dashboard-tabs-title">Reservas Ativas</h3>
            {reservasAtivas.length > 0 ? (
              <div className="dashboard-tabs-list">
                {reservasAtivas.map((reserva) => (
                  <ReservasList
                    key={reserva.id}
                    reserva={reserva}
                    onDelete={onDeleteReserva}
                  />
                ))}
              </div>
            ) : (
              <p className="dashboard-tabs-empty">
                <i className="material-icons">info</i>
                Nenhuma reserva ativa no momento
              </p>
            )}
          </div>
        )}

        {/* Aba 3 - Pagamentos a Receber */}
        {currentTab === 3 && (
          <div className="dashboard-tab-panel">
            <h3 className="dashboard-tabs-title">Pagamentos a Receber</h3>
            {pagamentosAReceber.length > 0 ? (
              <div className="dashboard-tabs-list">
                {pagamentosAReceber.map((reserva) => (
                  <ReservasList
                    key={reserva.id}
                    reserva={reserva}
                    onDelete={onDeleteReserva}
                  />
                ))}
              </div>
            ) : (
              <p className="dashboard-tabs-empty">
                <i className="material-icons">info</i>
                Nenhum pagamento pendente
              </p>
            )}
          </div>
        )}

        {/* Aba 4 - Check-in Hoje */}
        {currentTab === 4 && (
          <div className="dashboard-tab-panel">
            <h3 className="dashboard-tabs-title">Check-in Hoje</h3>
            {checkInsHoje.length > 0 ? (
              <div className="dashboard-tabs-list">
                {checkInsHoje.map((reserva) => (
                  <ReservasList
                    key={reserva.id}
                    reserva={reserva}
                    onDelete={onDeleteReserva}
                  />
                ))}
              </div>
            ) : (
              <p className="dashboard-tabs-empty">
                <i className="material-icons">info</i>
                Nenhum check-in agendado para hoje
              </p>
            )}
          </div>
        )}

        {/* Aba 5 - Check-out Hoje */}
        {currentTab === 5 && (
          <div className="dashboard-tab-panel">
            <h3 className="dashboard-tabs-title">Check-out Hoje</h3>
            {checkOutsHoje.length > 0 ? (
              <div className="dashboard-tabs-list">
                {checkOutsHoje.map((reserva) => (
                  <ReservasList
                    key={reserva.id}
                    reserva={reserva}
                    onDelete={onDeleteReserva}
                  />
                ))}
              </div>
            ) : (
              <p className="dashboard-tabs-empty">
                <i className="material-icons">info</i>
                Nenhum check-out agendado para hoje
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
