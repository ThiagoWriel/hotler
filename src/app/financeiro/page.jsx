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
import DateFilter from "../../components/DateFilter";
import ViewToggle from "../../components/ViewToggle";
import useFetch from "../../hooks/useFetch";
import useSearch from "../../hooks/useSearch";
import useDateFilter from "../../hooks/useDateFilter";

// Função para obter primeiro e último dia do mês atual
const getDefaultDateRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    start: formatDate(firstDay),
    end: formatDate(lastDay),
  };
};

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

  const defaultRange = getDefaultDateRange();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards");
  const [startDate, setStartDate] = useState(defaultRange.start);
  const [endDate, setEndDate] = useState(defaultRange.end);

  // Filtro de data aplicado primeiro para financeiro e reservas
  const { filteredData: dateFilteredFinanceiro } = useDateFilter(
    financeiroData,
    startDate,
    endDate,
    "data_transacao",
  );
  const { filteredData: dateFilteredReservas } = useDateFilter(
    reservasData,
    startDate,
    endDate,
    "checkin",
  );

  // Depois aplica o filtro de busca
  const { filteredData: filteredFinanceiro } = useSearch(
    dateFilteredFinanceiro,
    searchTerm,
  );
  const { filteredData: filteredReservas } = useSearch(
    dateFilteredReservas,
    searchTerm,
  );

  // Calculate financial metrics usando dados filtrados por data
  const financialMetrics = useMemo(() => {
    if (!dateFilteredFinanceiro && !dateFilteredReservas) {
      return {
        totalEntradas: 0,
        totalSaidas: 0,
        saldoLiquido: 0,
        receitaReservas: 0,
        mediaTransacao: 0,
        totalTransacoes: 0,
      };
    }

    const financeiro = dateFilteredFinanceiro || [];
    const reservas = dateFilteredReservas || [];

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

    // Receita de reservas
    const receitaReservas = reservas.reduce(
      (acc, item) => acc + (item.preco || 0),
      0,
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
  }, [dateFilteredFinanceiro, dateFilteredReservas]);

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

      {(financeiroData || reservasData) && (
        <>
          <div className="search">
            <Search value={searchTerm} onChange={setSearchTerm} />
          </div>
          {/* Filtro de Data */}
          <div className="filter-section">
            <DateFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>

          {/* Financial Summary Cards */}
          <div className="financial-summary-cards">
            <DashboardCard
              dashboard={{
                title: "Faturamento Total",
                value: formatCurrency(
                  financialMetrics.totalEntradas +
                    financialMetrics.receitaReservas,
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

          <hr />
          <br />
          <div className="controls-row">
            <div className="order-by">
              <p>Ordenar por: </p>
            </div>
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>

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
        </>
      )}
    </div>
  );
};

export default Financeiro;
