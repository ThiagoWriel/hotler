"use client";

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

        // Overlap condition: (StartA <= EndB) and (EndA >= StartB)
        return newCheckin <= resCheckout && newCheckout >= resCheckin;
      });

      return isAvailable;
    });
  };

  const filteredQuartos = [...getFilteredQuartos()].sort(
    (a, b) => Number(a.numero) - Number(b.numero),
  );

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
        onChange={(e) => onChange("pessoas", e.target.value)}
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

      <label htmlFor="preco">Preço</label>
      <input
        type="number"
        id="preco"
        value={preco}
        onChange={(e) => onChange("preco", e.target.value)}
      />

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
}) => {
  const { valor, tipo_transacao, metodo, data_transacao, origem } = values;

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="valor">Valor</label>
      <input
        type="number"
        id="valor"
        value={valor}
        onChange={(e) => onChange("valor", e.target.value)}
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
