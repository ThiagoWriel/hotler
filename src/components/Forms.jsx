"use client";

import { useState, useEffect } from "react";

/**
 * Componentes de formulário reutilizáveis para Create e Update.
 *
 * Uso:
 *   - `values`: objeto com os valores atuais dos campos
 *   - `onChange`: função para atualizar um campo específico (key, value)
 *   - `onSubmit`: função de submit do formulário
 *   - `isUpdate`: boolean para diferenciar texto do botão (Criar vs Atualizar)
 *   - `isPending`: boolean para estado de loading no botão
 *   - `formError`: mensagem de erro a exibir
 *   - Outras props específicas de cada formulário (ex: listas para selects)
 */

export const formatCPF = (val) => {
  return val
    .replace(/\D/g, "")
    .substring(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const formatTelefone = (val) => {
  return val
    .replace(/\D/g, "")
    .substring(0, 11)
    .replace(/^(\d{2})(\d)/g, "($1)$2")
    .replace(/(\d)(\d{4})$/, "$1-$2");
};

export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

// ================== QUARTO ==================
const QuartoForm = ({
  values,
  onChange,
  onSubmit,
  isUpdate = false,
  isPending = false,
  formError,
}) => {
  const { numero, tipo, estado, ocupado } = values;

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="numero">Numero</label>
      <input
        type="number"
        id="numero"
        value={numero}
        onChange={(e) => onChange("numero", e.target.value)}
      />
      <label htmlFor="tipo">Tipo</label>
      <select
        id="tipo"
        value={tipo}
        onChange={(e) => onChange("tipo", e.target.value)}
      >
        <option disabled value="">
          Selecione o tipo
        </option>
        <option value="Solteiro">Solteiro</option>
        <option value="Casal">Casal</option>
        <option value="Casal e Solteiro">Casal e Solteiro</option>
        <option value="Duplo">Duplo</option>
        <option value="Triplo">Triplo</option>
      </select>

      <label htmlFor="estado">Estado</label>
      <select
        id="estado"
        value={estado}
        onChange={(e) => onChange("estado", e.target.value)}
      >
        <option disabled value="">
          Selecione o estado
        </option>
        <option value="Limpo">Limpo</option>
        <option value="Sujo">Sujo</option>
        <option value="Em Manutenção">Em Manutenção</option>
      </select>

      <label htmlFor="ocupado">Ocupado</label>
      <select
        id="ocupado"
        value={ocupado}
        onChange={(e) => onChange("ocupado", e.target.value)}
      >
        <option disabled value="">
          Selecione
        </option>
        <option value="Sim">Sim</option>
        <option value="Não">Não</option>
      </select>

      {isPending ? (
        <button disabled>Carregando...</button>
      ) : (
        <button type="submit">
          {isUpdate ? "Atualizar Quarto" : "Criar Quarto"}
        </button>
      )}

      {formError && <p className="error">{formError}</p>}
    </form>
  );
};

// ================== CLIENTE ==================
const ClienteForm = ({
  values,
  onChange,
  onSubmit,
  isUpdate = false,
  isPending = false,
  formError,
}) => {
  const { nome, cpf, telefone, nascimento, obs } = values;

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="nome">Nome</label>
      <input
        type="text"
        id="nome"
        value={nome}
        onChange={(e) => onChange("nome", e.target.value)}
      />
      <label htmlFor="cpf">CPF</label>
      <input
        type="text"
        id="cpf"
        value={cpf}
        maxLength={14}
        onChange={(e) => onChange("cpf", formatCPF(e.target.value))}
      />
      <label htmlFor="telefone">Telefone</label>
      <input
        type="text"
        id="telefone"
        value={telefone}
        maxLength={14}
        onChange={(e) => onChange("telefone", formatTelefone(e.target.value))}
      />
      <label htmlFor="nascimento">Nascimento</label>
      <input
        type="date"
        id="nascimento"
        value={nascimento}
        onChange={(e) => onChange("nascimento", e.target.value)}
      />
      <label htmlFor="obs">Observações</label>
      <textarea
        id="obs"
        value={obs}
        onChange={(e) => onChange("obs", e.target.value)}
      />

      {isPending ? (
        <button disabled>Carregando...</button>
      ) : (
        <button type="submit">
          {isUpdate ? "Atualizar Cliente" : "Criar Cliente"}
        </button>
      )}

      {formError && <p className="error">{formError}</p>}
    </form>
  );
};

// ================== RESERVA ==================
const ReservaForm = ({
  values,
  onChange,
  onSubmit,
  isUpdate = false,
  isPending = false,
  formError,
  clientesList = [],
  quartosList = [],
  reservasList = [], // usado apenas no Create para filtrar quartos disponíveis
}) => {
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
    obs,
  } = values;

  // Estado para controlar o tipo de preço (total ou por diária)
  const [tipoPreco, setTipoPreco] = useState("total");
  const [valorDigitado, setValorDigitado] = useState("");

  // Inicializar valorDigitado com o valor de preco no modo de edição
  useEffect(() => {
    if (isUpdate && preco && valorDigitado === "") {
      setValorDigitado(String(preco));
    }
  }, [isUpdate, preco]);

  // Função para calcular o número de diárias
  const calcularDiarias = (dataCheckin, dataCheckout) => {
    if (!dataCheckin || !dataCheckout) return 0;
    const checkinDate = new Date(dataCheckin);
    const checkoutDate = new Date(dataCheckout);
    const diffTime = checkoutDate - checkinDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Função para calcular o preço total quando o tipo é por diária
  const calcularPrecoTotal = (valorDiaria, dataCheckin, dataCheckout) => {
    const diarias = calcularDiarias(dataCheckin, dataCheckout);
    if (diarias === 0 || !valorDiaria) return valorDiaria;
    return Math.abs(Number(valorDiaria)) * diarias;
  };

  // Handler para mudança no valor digitado
  const handleValorChange = (e) => {
    const valor = Math.abs(e.target.value);
    setValorDigitado(valor);

    if (tipoPreco === "diaria" && checkin && checkout) {
      const precoTotal = calcularPrecoTotal(valor, checkin, checkout);
      onChange("preco", Math.abs(precoTotal));
    } else {
      onChange("preco", Math.abs(valor));
    }
  };

  // Handler para mudança no tipo de preço
  const handleTipoPrecoChange = (e) => {
    const novoTipo = Math.abs(e.target.value);
    setTipoPreco(novoTipo);

    if (novoTipo === "diaria" && valorDigitado && checkin && checkout) {
      const precoTotal = calcularPrecoTotal(valorDigitado, checkin, checkout);
      onChange("preco", Math.abs(precoTotal));
    } else if (novoTipo === "total") {
      onChange("preco", Math.abs(valorDigitado));
    }
  };

  // Recalcular preço quando as datas mudam (se tipo for por diária)
  useEffect(() => {
    if (tipoPreco === "diaria" && valorDigitado && checkin && checkout) {
      const precoTotal = calcularPrecoTotal(valorDigitado, checkin, checkout);
      onChange("preco", Math.abs(precoTotal));
    }
  }, [checkin, checkout]);

  // Filtra quartos disponíveis no Create (considera reservas existentes)
  const getFilteredQuartos = () => {
    if (isUpdate) {
      // No Update, mostra todos os quartos
      return quartosList;
    }

    // No Create, filtra quartos em manutenção e com conflito de datas
    return quartosList.filter((quarto) => {
      if (quarto.estado === "em-manutencao") return false;

      if (!checkin || !checkout) return true;

      const isAvailable = !reservasList.some((reserva) => {
        if (reserva.quarto_id !== quarto.id) return false;

        const newCheckin = new Date(checkin);
        const newCheckout = new Date(checkout);
        const resCheckin = new Date(reserva.checkin);
        const resCheckout = new Date(reserva.checkout);

        // Overlap condition: permite checkout no mesmo dia do checkin de outra reserva
        // (StartA < EndB) and (EndA > StartB)
        return newCheckin < resCheckout && newCheckout > resCheckin;
      });

      return isAvailable;
    });
  };

  const filteredQuartos = [...getFilteredQuartos()].sort(
    (a, b) => Number(a.numero) - Number(b.numero),
  );

  // Calcula o número de diárias para exibição
  const numDiarias = calcularDiarias(checkin, checkout);

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="cliente_id">Cliente</label>
      <select
        id="cliente_id"
        value={cliente_id}
        onChange={(e) => onChange("cliente_id", e.target.value)}
      >
        <option disabled value="">
          Selecione um cliente
        </option>
        {clientesList.map((cliente) => (
          <option key={cliente.id} value={cliente.id}>
            {cliente.nome}
          </option>
        ))}
      </select>

      <label htmlFor="checkin">Check-in</label>
      <input
        type="date"
        id="checkin"
        value={checkin}
        onChange={(e) => onChange("checkin", e.target.value)}
      />
      <label htmlFor="checkout">Check-out</label>
      <input
        type="date"
        id="checkout"
        value={checkout}
        onChange={(e) => onChange("checkout", e.target.value)}
      />

      <label htmlFor="quarto_id">Quarto</label>
      <select
        id="quarto_id"
        value={quarto_id}
        onChange={(e) => onChange("quarto_id", e.target.value)}
      >
        <option disabled value="">
          Selecione um quarto
        </option>
        {filteredQuartos.map((quarto) => (
          <option key={quarto.id} value={quarto.id}>
            Quarto {quarto.numero}
          </option>
        ))}
      </select>

      <label htmlFor="pessoas">Pessoas</label>
      <input
        type="number"
        id="pessoas"
        value={pessoas}
        onChange={(e) => onChange("pessoas", Math.abs(e.target.value))}
      />

      <label htmlFor="estado_reserva">Estado da Reserva</label>
      <select
        id="estado_reserva"
        value={estado_reserva}
        onChange={(e) => onChange("estado_reserva", e.target.value)}
      >
        <option disabled value="">
          Selecione
        </option>
        <option value="Confirmada">Confirmada</option>
        <option value="Cancelada">Cancelada</option>
        <option value="Finalizada">Finalizada</option>
        <option value="Pendente">Pendente</option>
      </select>

      <label htmlFor="preco">
        Preço{" "}
        {tipoPreco === "diaria" &&
          numDiarias > 0 &&
          `(${numDiarias} diária${numDiarias > 1 ? "s" : ""})`}
      </label>
      <div className="preco-input-wrapper">
        <input
          type="number"
          id="preco"
          value={valorDigitado}
          onChange={handleValorChange}
          placeholder={
            tipoPreco === "diaria" ? "Valor por diária" : "Valor total"
          }
        />
        <select
          id="tipo_preco"
          className="preco-tipo-select"
          value={tipoPreco}
          onChange={handleTipoPrecoChange}
        >
          <option value="total">Total</option>
          <option value="diaria">Por Diária</option>
        </select>
      </div>
      {tipoPreco === "diaria" && valorDigitado && numDiarias > 0 && (
        <small className="preco-total-info">
          Total: R${" "}
          {calcularPrecoTotal(valorDigitado, checkin, checkout).toFixed(2)}
        </small>
      )}

      <br />

      <label htmlFor="tipo_pagamento">Tipo de Pagamento</label>
      <select
        id="tipo_pagamento"
        value={tipo_pagamento}
        onChange={(e) => onChange("tipo_pagamento", e.target.value)}
      >
        <option disabled value="">
          Selecione
        </option>
        <option value="Dinheiro">Dinheiro</option>
        <option value="Cartão">Cartão</option>
        <option value="PIX">PIX</option>
      </select>

      <label htmlFor="pagamento_realizado">Pagamento Realizado</label>
      <select
        id="pagamento_realizado"
        value={pagamento_realizado}
        onChange={(e) => onChange("pagamento_realizado", e.target.value)}
      >
        <option disabled value="">
          Selecione
        </option>
        <option value="Sim">Sim</option>
        <option value="Não">Não</option>
      </select>

      <label htmlFor="obs">Observações</label>
      <textarea
        id="obs"
        value={obs}
        onChange={(e) => onChange("obs", e.target.value)}
      />

      {isPending ? (
        <button disabled>Carregando...</button>
      ) : (
        <button type="submit">
          {isUpdate ? "Atualizar Reserva" : "Criar Reserva"}
        </button>
      )}

      {formError && <p className="error">{formError}</p>}
    </form>
  );
};

// ================== FINANCEIRO ==================
const FinanceiroForm = ({
  values,
  onChange,
  onSubmit,
  isUpdate = false,
  isPending = false,
  formError,
  recorrencia = null,
  onRecorrenciaChange = null,
}) => {
  const { valor, tipo_transacao, metodo, data_transacao, origem } = values;

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="valor">Valor</label>
      <input
        type="number"
        id="valor"
        value={valor}
        onChange={(e) => onChange("valor", Math.abs(e.target.value))}
      />
      <label htmlFor="tipo_transacao">Tipo de Transação</label>
      <select
        id="tipo_transacao"
        value={tipo_transacao}
        onChange={(e) => onChange("tipo_transacao", e.target.value)}
      >
        <option disabled value="">
          Selecione
        </option>
        <option value="Entrada">Entrada</option>
        <option value="Saída">Saída</option>
      </select>
      <label htmlFor="metodo">Método de Pagamento</label>
      <select
        id="metodo"
        value={metodo}
        onChange={(e) => onChange("metodo", e.target.value)}
      >
        <option disabled value="">
          Selecione
        </option>
        <option value="Dinheiro">Dinheiro</option>
        <option value="Cartão">Cartão</option>
        <option value="PIX">PIX</option>
      </select>
      <label htmlFor="data_transacao">Data da Transação</label>
      <input
        type="date"
        id="data_transacao"
        value={data_transacao}
        onChange={(e) => onChange("data_transacao", e.target.value)}
      />
      <label htmlFor="origem">Origem</label>
      <select
        id="origem"
        value={origem}
        onChange={(e) => onChange("origem", e.target.value)}
      >
        <option disabled value="">
          Selecione
        </option>
        <option value="Reserva">Reserva</option>
        <option value="Aluguel Piscina">Aluguel Piscina</option>
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

      {/* Seção de Recorrência - apenas no Create */}
      {!isUpdate && recorrencia && onRecorrenciaChange && (
        <>
          <div className="recorrencia-switch">
            <label htmlFor="recorrencia_ativa">Pagamento Recorrente</label>
            <input
              type="checkbox"
              id="recorrencia_ativa"
              checked={recorrencia.ativa}
              onChange={(e) => onRecorrenciaChange("ativa", e.target.checked)}
            />
          </div>

          {recorrencia.ativa && (
            <div className="recorrencia-campos">
              <label>Repetir a cada</label>
              <div className="recorrencia-intervalo">
                <input
                  type="number"
                  id="recorrencia_intervalo"
                  value={recorrencia.intervalo}
                  min="1"
                  max="365"
                  onChange={(e) =>
                    onRecorrenciaChange("intervalo", e.target.value)
                  }
                />
                <select
                  id="recorrencia_periodo"
                  value={recorrencia.periodo}
                  onChange={(e) =>
                    onRecorrenciaChange("periodo", e.target.value)
                  }
                >
                  <option value="dias">Dias</option>
                  <option value="semanas">Semanas</option>
                  <option value="meses">Meses</option>
                  <option value="anos">Anos</option>
                </select>
              </div>

              <label htmlFor="recorrencia_termino">Término</label>
              <select
                id="recorrencia_termino"
                value={recorrencia.termino}
                onChange={(e) => onRecorrenciaChange("termino", e.target.value)}
              >
                <option value="nunca">Nunca termina</option>
                <option value="repetir">Repetir até X vezes</option>
              </select>

              {recorrencia.termino === "repetir" && (
                <>
                  <label htmlFor="recorrencia_vezes">
                    Quantidade de repetições
                  </label>
                  <input
                    type="number"
                    id="recorrencia_vezes"
                    value={recorrencia.vezes}
                    min="2"
                    max="36"
                    onChange={(e) =>
                      onRecorrenciaChange("vezes", e.target.value)
                    }
                  />
                </>
              )}

              {recorrencia.termino === "nunca" && (
                <small className="recorrencia-aviso">
                  ⚠️ Serão criadas 12 transações (limite padrão)
                </small>
              )}
            </div>
          )}
        </>
      )}

      {isPending ? (
        <button disabled>Carregando...</button>
      ) : (
        <button type="submit">
          {isUpdate ? "Atualizar Transação" : "Criar Transação"}
        </button>
      )}

      {formError && <p className="error">{formError}</p>}
    </form>
  );
};

export { QuartoForm, ClienteForm, ReservaForm, FinanceiroForm };
