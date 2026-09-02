"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "./Forms";

/**
 * Card de resumo para transações financeiras.
 * Exibe um resumo em tempo real dos dados sendo preenchidos no formulário.
 */
export default function FinanceiroSummaryCard({ values }) {
  const { valor, tipo_transacao, metodo, data_transacao, origem } = values;

  // Formata o valor em moeda brasileira
  const formatCurrency = (value) => {
    if (!value) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Determina a cor do badge baseado no tipo de transação
  const getBadgeVariant = () => {
    if (!tipo_transacao) return "outline";
    return tipo_transacao === "Entrada" ? "success" : "destructive";
  };

  // Ícone e cor para o tipo de transação
  const getIconBg = () => {
    if (!tipo_transacao)
      return "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)";
    return tipo_transacao === "Entrada"
      ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
      : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
  };

  return (
    <Card className="summary-card">
      <CardHeader className="summary-card-header">
        <div className="summary-card-title-row">
          <CardTitle className="summary-card-title">
            Resumo da Transação
          </CardTitle>
          <Badge variant={getBadgeVariant()}>{tipo_transacao || "Tipo"}</Badge>
        </div>
      </CardHeader>

      <CardContent className="summary-card-content">
        {/* Valor */}
        <div className="summary-card-row">
          <div
            className="summary-card-icon"
            style={{ background: getIconBg() }}
          >
            <i className="material-icons">attach_money</i>
          </div>
          <div className="summary-card-info">
            <span className="summary-card-label">Valor</span>
            <span className="summary-card-value">{formatCurrency(valor)}</span>
          </div>
        </div>

        {/* Método de Pagamento */}
        <div className="summary-card-row">
          <div
            className="summary-card-icon"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            }}
          >
            <i className="material-icons">payments</i>
          </div>
          <div className="summary-card-info">
            <span className="summary-card-label">Método</span>
            <span className="summary-card-value">{metodo || "-"}</span>
          </div>
        </div>

        {/* Data */}
        <div className="summary-card-row">
          <div
            className="summary-card-icon"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            }}
          >
            <i className="material-icons">calendar_today</i>
          </div>
          <div className="summary-card-info">
            <span className="summary-card-label">Data</span>
            <span className="summary-card-value">
              {data_transacao ? formatDate(data_transacao) : "-"}
            </span>
          </div>
        </div>

        {/* Origem */}
        <div className="summary-card-row">
          <div
            className="summary-card-icon"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            }}
          >
            <i className="material-icons">category</i>
          </div>
          <div className="summary-card-info">
            <span className="summary-card-label">Origem</span>
            <span className="summary-card-value">{origem || "-"}</span>
          </div>
        </div>

        {/* Divisor */}
        <hr className="summary-card-divider" />

        {/* Total/Resumo Final */}
        <div className="summary-card-total">
          <span className="summary-card-total-label">Total</span>
          <span className="summary-card-total-value">
            {formatCurrency(valor)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
