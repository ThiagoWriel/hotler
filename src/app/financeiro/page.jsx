"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateButtonFinanceiro } from "../../components/Botton";
import { FinanceiroCard } from "../../components/Card";
import { FinanceiroList } from "../../components/List";
import FinanceiroCards from "../../components/FinanceiroCards";
import Search from "../../components/Search";
import DateFilter from "../../components/DateFilter";
import ViewToggle from "../../components/ViewToggle";
import useFetch from "../../hooks/useFetch";
import useSearch from "../../hooks/useSearch";
import useDateFilter from "../../hooks/useDateFilter";
import useUserRole from "../../hooks/useRole";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const router = useRouter();
  const { role, loading: roleLoading } = useUserRole();

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

  // Proteção de rota: redireciona não-admins para o dashboard
  useEffect(() => {
    if (!roleLoading && role !== "admin") {
      router.push("/dashboard");
    }
  }, [role, roleLoading, router]);

  // Filtro de data aplicado primeiro para financeiro
  const { filteredData: dateFilteredFinanceiro } = useDateFilter(
    financeiroData,
    startDate,
    endDate,
    "data_transacao",
  );

  // Aplica filtro de origem [useOrigemFilter]
  const origemFilteredFinanceiro = useOrigemFilter(
    dateFilteredFinanceiro,
    selectedOrigem,
  );

  // Depois aplica o filtro de busca
  const { filteredData: filteredFinanceiro } = useSearch(
    origemFilteredFinanceiro,
    searchTerm,
  );

  // Mostra loading enquanto verifica o role
  if (roleLoading) {
    return (
      <div className="financeiro">
        <p>Verificando permissões...</p>
      </div>
    );
  }

  // Se não for admin, não renderiza nada (será redirecionado)
  if (role !== "admin") {
    return null;
  }

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

          {/* Financial Summary Cards using new component */}
          <FinanceiroCards financeiroData={dateFilteredFinanceiro} />

          <hr />
          <br />
          <div className="controls-row">
            <div className="order-by">
              <p>Filtrar por origem: </p>
              <Select value={selectedOrigem} onValueChange={setSelectedOrigem}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Reserva">Reserva</SelectItem>
                  <SelectItem value="Aluguel Piscina">
                    Aluguel Piscina
                  </SelectItem>
                  <SelectItem value="Funcionários">Funcionários</SelectItem>
                  <SelectItem value="Café da manhã">Café da manhã</SelectItem>
                  <SelectItem value="Energia">Energia</SelectItem>
                  <SelectItem value="Água">Água</SelectItem>
                  <SelectItem value="Reparos Diversos">
                    Reparos Diversos
                  </SelectItem>
                  <SelectItem value="Limpeza">Limpeza</SelectItem>
                  <SelectItem value="Produtos">Produtos</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Impostos">Impostos</SelectItem>
                  <SelectItem value="Internet">Internet</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
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
