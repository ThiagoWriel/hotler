"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

const UpdateQuarto = () => {
  const { id } = useParams();
  const router = useRouter();

  const [numero, setNumero] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");
  const [ocupado, setOcupado] = useState("");
  const [formError, setFormError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!numero || !tipo || !estado || !ocupado) {
      setFormError("Preencha todos os campos");
      return;
    }

    setIsPending(true);

    const { data, error } = await supabase
      .from("quartos")
      .update({ numero, tipo, estado, ocupado })
      .eq("id", id)
      .select();

    if (error) {
      setFormError("Erro ao atualizar");
      setIsPending(false);
    }
    if (data) {
      setFormError(null);
      router.push("/quartos");
      router.refresh();
      setIsPending(false);
    }
  };

  useEffect(() => {
    const fetchQuarto = async () => {
      const { data, error } = await supabase
        .from("quartos")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        router.push("/quartos");
      }
      if (data) {
        setNumero(data.numero);
        setTipo(data.tipo);
        setEstado(data.estado);
        setOcupado(data.ocupado);
      }
    };
    fetchQuarto();
  }, [id, router]);

  return (
    <div className="page-quartos">
      <h2>Editar Quarto</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="numero">Numero</label>
        <input
          type="number"
          id="numero"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
        />
        <label htmlFor="tipo">Tipo</label>
        <select
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option disabled value="">
            Selecione o tipo
          </option>
          <option value="individual">Solteiro</option>
          <option value="duplo">Casal</option>
          <option value="triplo">Triplo</option>
          <option value="quadra">Quadra</option>
        </select>

        <label htmlFor="estado">Estado</label>
        <select
          id="estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option disabled value="">
            Selecione o estado
          </option>
          <option value="limpo">Limpo</option>
          <option value="sujo">Sujo</option>
          <option value="em-manutencao">Em Manutenção</option>
        </select>

        <label htmlFor="ocupado">Ocupado</label>
        <select
          id="ocupado"
          value={ocupado}
          onChange={(e) => setOcupado(e.target.value)}
        >
          <option disabled value="">
            Selecione
          </option>
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </select>
        {isPending ? (
          <button disabled>Carregando...</button>
        ) : (
          <button type="submit">Atualizar Quarto</button>
        )}

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
};

const UpdateCliente = () => {
  const { id } = useParams();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [obs, setObs] = useState("");
  const [formError, setFormError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !cpf || !telefone || !nascimento || !obs) {
      setFormError("Preencha todos os campos");
      return;
    }

    setIsPending(true);

    const { data, error } = await supabase
      .from("clientes")
      .update({ nome, cpf, telefone, nascimento, obs })
      .eq("id", id)
      .select();

    if (error) {
      setFormError("Erro ao atualizar");
      setIsPending(false);
    }
    if (data) {
      setFormError(null);
      router.push("/clientes");
      router.refresh();
      setIsPending(false);
    }
  };

  useEffect(() => {
    const fetchCliente = async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        router.push("/clientes");
      }
      if (data) {
        setNome(data.nome);
        setCpf(data.cpf);
        setTelefone(data.telefone);
        setNascimento(data.nascimento);
        setObs(data.obs);
      }
    };
    fetchCliente();
  }, [id, router]);

  return (
    <div className="page-clientes">
      <h2>Editar Cliente</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <label htmlFor="cpf">CPF</label>
        <input
          type="number"
          id="cpf"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />
        <label htmlFor="telefone">Telefone</label>
        <input
          type="number"
          id="telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <label htmlFor="nascimento">Nascimento</label>
        <input
          type="date"
          id="nascimento"
          value={nascimento}
          onChange={(e) => setNascimento(e.target.value)}
        />
        <label htmlFor="obs">Observações</label>
        <textarea
          id="obs"
          value={obs}
          onChange={(e) => setObs(e.target.value)}
        />

        {isPending ? (
          <button disabled>Carregando...</button>
        ) : (
          <button type="submit">Atualizar Cliente</button>
        )}

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
};

const UpdateReserva = () => {
  const [isPending, setIsPending] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const [quarto_reserva, setQuartoReserva] = useState("");
  const [cliente_reserva, setClienteReserva] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [pessoas, setPessoas] = useState("");
  const [estado_reserva, setEstadoReserva] = useState("");
  const [preco, setPreco] = useState("");
  const [tipo_pagamento, setTipoPagamento] = useState("");
  const [pagamento_realizado, setPagamentoRealizado] = useState("");
  const [obs, setObs] = useState("");
  const [formError, setFormError] = useState(null);

  const [clientesList, setClientesList] = useState([]);
  const [quartosList, setQuartosList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !quarto_reserva ||
      !cliente_reserva ||
      !checkin ||
      !checkout ||
      !pessoas ||
      !estado_reserva ||
      !preco ||
      !tipo_pagamento ||
      !pagamento_realizado
    ) {
      setFormError("Preencha todos os campos");
      return;
    }

    setIsPending(true);

    const { data, error } = await supabase
      .from("reservas")
      .update({
        quarto_reserva,
        cliente_reserva,
        checkin,
        checkout,
        pessoas,
        estado_reserva,
        preco,
        tipo_pagamento,
        pagamento_realizado,
        obs,
      })
      .eq("id", id)
      .select();

    if (error) {
      setFormError("Erro ao atualizar");
      setIsPending(false);
    }
    if (data) {
      setFormError(null);
      router.push("/reservas");
      router.refresh();
      setIsPending(false);
    }
  };

  useEffect(() => {
    const fetchReserva = async () => {
      const { data, error } = await supabase
        .from("reservas")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        router.push("/reservas");
      }
      if (data) {
        setQuartoReserva(data.quarto_reserva);
        setClienteReserva(data.cliente_reserva);
        setCheckin(data.checkin);
        setCheckout(data.checkout);
        setPessoas(data.pessoas);
        setEstadoReserva(data.estado_reserva);
        setPreco(data.preco);
        setTipoPagamento(data.tipo_pagamento);
        setPagamentoRealizado(data.pagamento_realizado);
        setObs(data.obs || "");
      }

      // Fetch lists for dropdowns
      const { data: clientesData } = await supabase
        .from("clientes")
        .select("nome");
      if (clientesData) setClientesList(clientesData);

      const { data: quartosData } = await supabase
        .from("quartos")
        .select("numero");
      if (quartosData) setQuartosList(quartosData);
    };
    fetchReserva();
  }, [id, router]);

  return (
    <div className="page-reservas">
      <h2>Editar Reserva #{id}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="cliente_reserva">Cliente</label>
        <select
          id="cliente_reserva"
          value={cliente_reserva}
          onChange={(e) => setClienteReserva(e.target.value)}
        >
          <option disabled value="">
            Selecione um cliente
          </option>
          {clientesList.map((cliente, index) => (
            <option key={index} value={cliente.nome}>
              {cliente.nome}
            </option>
          ))}
        </select>

        <label htmlFor="quarto_reserva">Quarto</label>
        <select
          id="quarto_reserva"
          value={quarto_reserva}
          onChange={(e) => setQuartoReserva(e.target.value)}
        >
          <option disabled value="">
            Selecione um quarto
          </option>
          {quartosList.map((quarto, index) => (
            <option key={index} value={quarto.numero}>
              {quarto.numero}
            </option>
          ))}
        </select>
        <label htmlFor="checkin">Check-in</label>
        <input
          type="date"
          id="checkin"
          value={checkin}
          onChange={(e) => setCheckin(e.target.value)}
        />
        <label htmlFor="checkout">Check-out</label>
        <input
          type="date"
          id="checkout"
          value={checkout}
          onChange={(e) => setCheckout(e.target.value)}
        />
        <label htmlFor="pessoas">Pessoas</label>
        <input
          type="number"
          id="pessoas"
          value={pessoas}
          onChange={(e) => setPessoas(e.target.value)}
        />
        <label htmlFor="estado_reserva">Estado da Reserva</label>
        <select
          id="estado_reserva"
          value={estado_reserva}
          onChange={(e) => setEstadoReserva(e.target.value)}
        >
          <option disabled value="">
            Selecione
          </option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
          <option value="pendente">Pendente</option>
        </select>
        <label htmlFor="preco">Preço</label>
        <input
          type="number"
          id="preco"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />
        <label htmlFor="tipo_pagamento">Tipo de Pagamento</label>
        <select
          id="tipo_pagamento"
          value={tipo_pagamento}
          onChange={(e) => setTipoPagamento(e.target.value)}
        >
          <option disabled value="">
            Selecione
          </option>
          <option value="dinheiro">Dinheiro</option>
          <option value="cartao">Cartão</option>
          <option value="pix">PIX</option>
        </select>
        <label htmlFor="pagamento_realizado">Pagamento Realizado</label>
        <select
          id="pagamento_realizado"
          value={pagamento_realizado}
          onChange={(e) => setPagamentoRealizado(e.target.value)}
        >
          <option disabled value="">
            Selecione
          </option>
          <option value="sim">Sim</option>
          <option value="nao">Não</option>
        </select>
        <label htmlFor="obs">Observações</label>
        <textarea
          id="obs"
          value={obs}
          onChange={(e) => setObs(e.target.value)}
        />

        {isPending ? (
          <button disabled>Carregando...</button>
        ) : (
          <button type="submit">Atualizar Reserva</button>
        )}

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
};

export { UpdateQuarto, UpdateCliente, UpdateReserva };
