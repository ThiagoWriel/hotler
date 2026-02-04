"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "./Forms";

/**
 * Card de resumo para reservas.
 * Exibe um resumo em tempo real dos dados sendo preenchidos no formulário.
 */
export default function ReservaSummaryCard({
  values,
  clientesList = [],
  quartosList = [],
}) {
  const {
    cliente_id,
    quarto_id,
    checkin,
    checkout,
    pessoas,
    estado_reserva,
    preco,
    tipo_pagamento,
    pagamento_realizado,
  } = values;

  // Encontra o nome do cliente
  const clienteNome =
    clientesList.find((c) => c.id === cliente_id)?.nome || "-";

  // Encontra o número do quarto
  const quartoNumero =
    quartosList.find((q) => q.id === quarto_id)?.numero || "-";

  // Calcula a duração em noites
  const calcularNoites = () => {
    if (!checkin || !checkout) return 0;
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const diffTime = checkoutDate - checkinDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const noites = calcularNoites();

  // Formata datas para exibição
  const formatDatas = () => {
    if (!checkin || !checkout) return "-";
    return `${formatDate(checkin)} → ${formatDate(checkout)}`;
  };

  // Formata o valor em moeda brasileira
  const formatCurrency = (value) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Determina a cor do badge baseado no estado
  const getBadgeVariant = () => {
    if (!estado_reserva) return "outline";
    switch (estado_reserva) {
      case "Confirmada":
        return "success";
      case "Cancelada":
        return "destructive";
      case "Finalizada":
        return "default";
      case "Pendente":
        return "warning";
      default:
        return "outline";
    }
  };

  return (
    <Card className="summary-card">
      <CardHeader className="summary-card-header">
        <div className="summary-card-title-row">
          <CardTitle className="summary-card-title">
            Resumo da Reserva
          </CardTitle>
          <Badge variant={getBadgeVariant()}>
            {estado_reserva || "Status"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="summary-card-content">
        {/* Hóspede */}
        <div className="summary-card-row">
          <div
            className="summary-card-icon"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            }}
          >
            <i className="material-icons">person</i>
          </div>
          <div className="summary-card-info">
            <span className="summary-card-label">Hóspede</span>
            <span className="summary-card-value">{clienteNome}</span>
          </div>
        </div>

        {/* Datas */}
        <div className="summary-card-row">
          <div
            className="summary-card-icon"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            }}
          >
            <i className="material-icons">date_range</i>
          </div>
          <div className="summary-card-info">
            <span className="summary-card-label">Datas</span>
            <span className="summary-card-value">{formatDatas()}</span>
          </div>
        </div>

        {/* Duração */}
        <div className="summary-card-row">
          <div
            className="summary-card-icon"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            }}
          >
            <i className="material-icons">nights_stay</i>
          </div>
          <div className="summary-card-info">
            <span className="summary-card-label">Duração</span>
            <span className="summary-card-value">
              {noites} {noites === 1 ? "Noite" : "Noites"}
            </span>
          </div>
        </div>

        {/* Quarto */}
        <div className="summary-card-row">
          <div
            className="summary-card-icon"
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            }}
          >
            <i className="material-icons">hotel</i>
          </div>
          <div className="summary-card-info">
            <span className="summary-card-label">Quarto</span>
            <span className="summary-card-value">
              {quartoNumero !== "-"
                ? `Quarto ${quartoNumero}`
                : "Nenhum quarto selecionado"}
            </span>
          </div>
        </div>

        {/* Pessoas */}
        <div className="summary-card-row">
          <div
            className="summary-card-icon"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            }}
          >
            <i className="material-icons">groups</i>
          </div>
          <div className="summary-card-info">
            <span className="summary-card-label">Pessoas</span>
            <span className="summary-card-value">{pessoas || "0"}</span>
          </div>
        </div>

        {/* Pagamento */}
        <div className="summary-card-row">
          <div
            className="summary-card-icon"
            style={{
              background:
                pagamento_realizado === "Sim"
                  ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                  : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            }}
          >
            <i className="material-icons">
              {pagamento_realizado === "Sim" ? "check_circle" : "pending"}
            </i>
          </div>
          <div className="summary-card-info">
            <span className="summary-card-label">
              Pagamento ({tipo_pagamento || "-"})
            </span>
            <span className="summary-card-value">
              {pagamento_realizado === "Sim" ? "Pago" : "Pendente"}
            </span>
          </div>
        </div>

        {/* Divisor */}
        <hr className="summary-card-divider" />

        {/* Total */}
        <div className="summary-card-total">
          <span className="summary-card-total-label">Total</span>
          <span className="summary-card-total-value">
            {formatCurrency(preco)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
