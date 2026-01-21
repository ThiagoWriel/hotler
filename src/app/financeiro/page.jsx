"use client";

import { useState, useMemo } from "react";
import { CreateButtonFinanceiro } from "../../components/Botton";
import { FinanceiroCard, DashboardCard } from "../../components/Card";
import { FinanceiroList } from "../../components/List";
import Search from "../../components/Search";
import DateFilter from "../../components/DateFilter";
import ViewToggle from "../../components/ViewToggle";
import useFetch from "../../hooks/useFetch";
import useSearch from "../../hooks/useSearch";
import useDateFilter from "../../hooks/useDateFilter";
import { Button } from "@/components/ui/button";

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

// Hook para filtrar por origem
const useOrigemFilter = (data, selectedOrigem) => {
  return useMemo(() => {
    if (!data) return [];
    if (selectedOrigem === "Todos") return data;
    return data.filter((item) => item.origem === selectedOrigem);
  }, [data, selectedOrigem]);
};

const Financeiro = () => {
  const {
    isPending,
    fetchError,
    hotler: financeiroData,
    handleDelete,
  } = useFetch("financeiro");

  const defaultRange = getDefaultDateRange();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards");
  const [startDate, setStartDate] = useState(defaultRange.start);
  const [endDate, setEndDate] = useState(defaultRange.end);
  const [selectedOrigem, setSelectedOrigem] = useState("Todos");

  // Filtro de data aplicado primeiro para financeiro
  const { filteredData: dateFilteredFinanceiro } = useDateFilter(
    financeiroData,
    startDate,
    endDate,
    "data_transacao",
  );

  // Aplica filtro de origem
  const origemFilteredFinanceiro = useOrigemFilter(
    dateFilteredFinanceiro,
    selectedOrigem,
  );

  // Depois aplica o filtro de busca
  const { filteredData: filteredFinanceiro } = useSearch(
    origemFilteredFinanceiro,
    searchTerm,
  );

  // Calculate financial metrics usando dados filtrados por data
  const financialMetrics = useMemo(() => {
    if (!dateFilteredFinanceiro) {
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
  }, [dateFilteredFinanceiro]);

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
      {fetchError && <p className="error">{fetchError}</p>}
      <div className="loading">{isPending && <p>Carregando...</p>}</div>

      {financeiroData && (
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

          <hr />
          <br />
          <div className="controls-row">
            <div className="order-by">
              <p>Filtrar por origem: </p>
              <select
                value={selectedOrigem}
                onChange={(e) => setSelectedOrigem(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="Reserva">Reserva</option>
                <option value="Funcionários">Funcionários</option>
                <option value="Café da manhã">Café da manhã</option>
                <option value="Energia">Energia</option>
                <option value="Água">Água</option>
                <option value="Reparos Diversos">Reparos Diversos</option>
                <option value="Limpeza">Limpeza</option>
                <option value="Produtos">Produtos</option>
                <option value="Marketing">Marketing</option>
                <option value="Impostos">Impostos</option>
                <option value="Internet">Internet</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>

          {viewMode === "cards" ? (
            <div className="financeiro-cards">
              {filteredFinanceiro.map((financeiro) => (
                <FinanceiroCard
                  key={financeiro.id}
                  financeiro={financeiro}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="financeiro-list">
              {filteredFinanceiro.map((financeiro) => (
                <FinanceiroList
                  key={financeiro.id}
                  financeiro={financeiro}
                  onDelete={handleDelete}
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
