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
  const totalTabs = 2;

  // Filtrar quartos disponíveis (limpos e não ocupados)
  const quartosDisponiveis = quartos
    ? quartos.filter((q) => q.estado === "limpo" && q.ocupado === "não")
    : [];

  // Filtrar reservas ativas (confirmadas)
  const reservasAtivas = reservas
    ? reservas.filter((r) => r.estado_reserva === "Confirmada")
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
      </div>
    </div>
  );
};
