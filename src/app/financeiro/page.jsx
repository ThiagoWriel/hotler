"use client";

import { useState, useMemo } from "react";
import { CreateButtonFinanceiro } from "../../components/Botton";
import {
  FinanceiroCard,
  FinanceiroReservasCard,
  DashboardCard,
} from "../../components/Card";
import { FinanceiroList, FinanceiroReservasList } from "../../components/List";
import Search from "../../components/Search";
import ViewToggle from "../../components/ViewToggle";
import useFetch from "../../hooks/useFetch";
import useSearch from "../../hooks/useSearch";

const Financeiro = () => {
  const {
    isPending: isPendingFinanceiro,
    fetchError: fetchErrorFinanceiro,
    hotler: financeiroData,
    handleDelete: handleDeleteFinanceiro,
  } = useFetch("financeiro");

  const {
    isPending: isPendingReservas,
    fetchError: fetchErrorReservas,
    hotler: reservasData,
    handleDelete: handleDeleteReservas,
  } = useFetch("reservas");

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards");

  const { filteredData: filteredFinanceiro } = useSearch(
    financeiroData,
    searchTerm
  );
  const { filteredData: filteredReservas } = useSearch(
    reservasData,
    searchTerm
  );

  // Calculate financial metrics
  const financialMetrics = useMemo(() => {
    if (!financeiroData && !reservasData) {
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
    const reservas = reservasData || [];

    // Total de entradas (receitas)
    const totalEntradas = financeiro
      .filter((item) => item.tipo_transacao === "Entrada")
      .reduce((acc, item) => acc + (item.valor || 0), 0);

    // Total de saídas (despesas)
    const totalSaidas = financeiro
      .filter(
        (item) =>
          item.tipo_transacao === "Saída" || item.tipo_transacao === "Saida"
      )
      .reduce((acc, item) => acc + (item.valor || 0), 0);

    // Receita de reservas
    const receitaReservas = reservas.reduce(
      (acc, item) => acc + (item.preco || 0),
      0
    );

    // Saldo líquido total
    const saldoLiquido = totalEntradas - totalSaidas + receitaReservas;

    // Total de transações
    const totalTransacoes = financeiro.length + reservas.length;

    // Média por transação
    const valorTotal = totalEntradas + receitaReservas;
    const transacoesEntrada =
      financeiro.filter((item) => item.tipo_transacao === "Entrada").length +
      reservas.length;
    const mediaTransacao =
      transacoesEntrada > 0 ? valorTotal / transacoesEntrada : 0;

    return {
      totalEntradas,
      totalSaidas,
      saldoLiquido,
      receitaReservas,
      mediaTransacao,
      totalTransacoes,
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
    <div className="financeiro">
      <div className="header-pages">
        <h2>Financeiro</h2>
        <div className="header-actions">
          <CreateButtonFinanceiro />
        </div>
      </div>
      {fetchErrorFinanceiro && <p className="error">{fetchErrorFinanceiro}</p>}
      {fetchErrorReservas && <p className="error">{fetchErrorReservas}</p>}
      <div className="loading">
        {isPendingFinanceiro && isPendingReservas && <p>Carregando...</p>}
      </div>

      {/* Financial Summary Cards */}
      {(financeiroData || reservasData) && (
        <div className="financial-summary-cards">
          <DashboardCard
            dashboard={{
              title: "Faturamento Total",
              value: formatCurrency(
                financialMetrics.totalEntradas +
                  financialMetrics.receitaReservas
              ),
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
      )}

      <div className="controls-row">
        <div className="order-by">
          <p>Ordenar por: </p>
        </div>
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>
      <div className="search">
        <Search value={searchTerm} onChange={setSearchTerm} />
      </div>
      {(financeiroData || reservasData) && (
        <div className="financeiro">
          {viewMode === "cards" ? (
            <div className="financeiro-cards">
              {filteredFinanceiro.map((financeiro) => (
                <FinanceiroCard
                  key={financeiro.id}
                  financeiro={financeiro}
                  onDelete={handleDeleteFinanceiro}
                />
              ))}
              {filteredReservas.map((reserva) => (
                <FinanceiroReservasCard
                  key={reserva.id}
                  reserva={reserva}
                  onDelete={handleDeleteReservas}
                />
              ))}
            </div>
          ) : (
            <div className="financeiro-list">
              {filteredFinanceiro.map((financeiro) => (
                <FinanceiroList
                  key={financeiro.id}
                  financeiro={financeiro}
                  onDelete={handleDeleteFinanceiro}
                />
              ))}
              {filteredReservas.map((reserva) => (
                <FinanceiroReservasList
                  key={reserva.id}
                  reserva={reserva}
                  onDelete={handleDeleteReservas}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Financeiro;
