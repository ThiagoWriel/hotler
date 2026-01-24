import { useMemo } from "react";
import { DashboardCard } from "./Card";

export default function FinanceiroCards({ financeiroData, reservasData }) {
  // Calculate financial metrics using filtered data
  const financialMetrics = useMemo(() => {
    if (!financeiroData) {
      return {
        totalEntradas: 0,
        totalSaidas: 0,
        saldoLiquido: 0,
        receitaReservas: 0,
        dinheiroAReceber: 0,
        dinheiroRecebido: 0,
      };
    }

    const financeiro = financeiroData || [];
    const reservas = reservasData || [];

    // Total de entradas (receitas)
    const totalEntradas = financeiro
      .filter((item) => item.tipo_transacao === "Entrada")
      .reduce((acc, item) => acc + (item.valor || 0), 0);

    // Total de saídas (despesas)
    const totalSaidas = financeiro
      .filter(
        (item) =>
          item.tipo_transacao === "Saída" || item.tipo_transacao === "Saida",
      )
      .reduce((acc, item) => acc + (item.valor || 0), 0);

    // Receita de reservas (origem === "Reserva")
    const receitaReservas = financeiro
      .filter((item) => item.origem === "Reserva")
      .reduce((acc, item) => acc + (item.valor || 0), 0);

    // Saldo líquido total
    const saldoLiquido = totalEntradas - totalSaidas;

    // Dinheiro a receber (reservas com pagamento_realizado === "Não")
    const dinheiroAReceber = reservas
      .filter((reserva) => reserva.pagamento_realizado === "Não")
      .reduce((acc, reserva) => acc + (Number(reserva.preco) || 0), 0);

    // Dinheiro recebido (faturamento total - dinheiro a receber)
    const dinheiroRecebido = totalEntradas - dinheiroAReceber;

    return {
      totalEntradas,
      totalSaidas,
      saldoLiquido,
      receitaReservas,
      dinheiroAReceber,
      dinheiroRecebido,
    };
  }, [financeiroData, reservasData]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="financial-summary-cards">
      <DashboardCard
        dashboard={{
          title: "Faturamento Total",
          value: formatCurrency(financialMetrics.totalEntradas),
          icon: "trending_up",
        }}
      />
      <DashboardCard
        dashboard={{
          title: "Despesas",
          value: formatCurrency(financialMetrics.totalSaidas),
          icon: "trending_down",
        }}
      />
      <DashboardCard
        dashboard={{
          title: "Saldo Líquido",
          value: formatCurrency(financialMetrics.saldoLiquido),
          icon: "account_balance_wallet",
        }}
      />
      <DashboardCard
        dashboard={{
          title: "Receita de Reservas",
          value: formatCurrency(financialMetrics.receitaReservas),
          icon: "hotel",
        }}
      />
      <DashboardCard
        dashboard={{
          title: "Dinheiro a Receber",
          value: formatCurrency(financialMetrics.dinheiroAReceber),
          icon: "pending_actions",
        }}
      />
      <DashboardCard
        dashboard={{
          title: "Dinheiro Recebido",
          value: formatCurrency(financialMetrics.dinheiroRecebido),
          icon: "payments",
        }}
      />
    </div>
  );
}
