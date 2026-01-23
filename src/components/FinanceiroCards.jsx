import { useMemo } from "react";
import { DashboardCard } from "./Card";

export default function FinanceiroCards({ financeiroData }) {
  // Calculate financial metrics using filtered data
  const financialMetrics = useMemo(() => {
    if (!financeiroData) {
      return {
        totalEntradas: 0,
        totalSaidas: 0,
        saldoLiquido: 0,
        receitaReservas: 0,
        mediaTransacao: 0,
        totalTransacoes: 0,
      };
    }

    const financeiro = financeiroData || [];

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

    // Total de transações
    const totalTransacoes = financeiro.length;

    // Média por transação de entrada
    const transacoesEntrada = financeiro.filter(
      (item) => item.tipo_transacao === "Entrada",
    ).length;
    const mediaTransacao =
      transacoesEntrada > 0 ? totalEntradas / transacoesEntrada : 0;

    return {
      totalEntradas,
      totalSaidas,
      saldoLiquido,
      receitaReservas,
      mediaTransacao,
      totalTransacoes,
    };
  }, [financeiroData]);

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
          title: "Média por Transação",
          value: formatCurrency(financialMetrics.mediaTransacao),
          icon: "analytics",
        }}
      />
      <DashboardCard
        dashboard={{
          title: "Total de Transações",
          value: financialMetrics.totalTransacoes,
          icon: "receipt_long",
        }}
      />
    </div>
  );
}
