"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { QuartoForm, ClienteForm, ReservaForm, FinanceiroForm } from "./Forms";

const CriarQuarto = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    numero: "",
    tipo: "",
    estado: "Limpo",
    ocupado: "Não",
  });
  const [formError, setFormError] = useState(null);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { numero, tipo, estado, ocupado } = values;

    if (!numero || !tipo || !estado || !ocupado) {
      setFormError("Preencha todos os campos");
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("quartos")
      .insert({ numero, estado, ocupado, tipo })
      .select();

    if (error) {
      setFormError("Nao conseguiu criar o quarto");
      return;
    }
    if (data) {
      console.log(data);
      setFormError(null);
      router.push("/quartos");
      router.refresh();
    }
  };

  return (
    <div className="criar-quarto">
      <div className="header-pages">
        <h2>Criar Quarto</h2>
      </div>
      <QuartoForm
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isUpdate={false}
        formError={formError}
      />
    </div>
  );
};

const CriarCliente = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    nome: "",
    cpf: "000.000.000-00",
    telefone: "(00)00000-0000",
    nascimento: "2000-01-01",
    obs: "Sem observações",
  });
  const [formError, setFormError] = useState(null);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nome, cpf, telefone, nascimento, obs } = values;

    if (!nome) {
      setFormError("Preencha pelo menos o nome");
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("clientes")
      .insert({
        nome,
        cpf: cpf.replace(/\D/g, ""),
        telefone: telefone.replace(/\D/g, ""),
        nascimento,
        obs,
      })
      .select();

    if (error) {
      setFormError("Nao conseguiu criar o cliente");
      return;
    }
    if (data) {
      console.log(data);
      setFormError(null);
      router.push("/clientes");
      router.refresh();
    }
  };

  return (
    <div className="criar-cliente">
      <div className="header-pages">
        <h2>Criar Cliente</h2>
      </div>
      <ClienteForm
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isUpdate={false}
        formError={formError}
      />
    </div>
  );
};

const CriarReserva = () => {
  const router = useRouter();

  const [values, setValues] = useState({
    quarto_id: "",
    cliente_id: "",
    checkin: "",
    checkout: "",
    pessoas: "",
    estado_reserva: "Confirmada",
    preco: "",
    tipo_pagamento: "Dinheiro",
    pagamento_realizado: "",
    obs: "-",
  });
  const [formError, setFormError] = useState(null);

  const [clientesList, setClientesList] = useState([]);
  const [quartosList, setQuartosList] = useState([]);
  const [reservasList, setReservasList] = useState([]);

  // Lê parâmetros da URL (quarto e checkin vindos do calendário)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const quartoParam = params.get("quarto");
    const checkinParam = params.get("checkin");

    if (quartoParam || checkinParam) {
      setValues((prev) => ({
        ...prev,
        ...(quartoParam && { quarto_id: quartoParam }),
        ...(checkinParam && { checkin: checkinParam }),
      }));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: clientesData } = await supabase
        .from("clientes")
        .select("id, nome");
      if (clientesData) setClientesList(clientesData);

      const { data: quartosData } = await supabase
        .from("quartos")
        .select("id, numero, estado, ocupado");
      if (quartosData) setQuartosList(quartosData);

      const { data: reservasData } = await supabase
        .from("reservas")
        .select("quarto_id, checkin, checkout, estado_reserva")
        .neq("estado_reserva", "cancelada");
      if (reservasData) setReservasList(reservasData);
    };
    fetchData();
  }, []);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      quarto_id,
      cliente_id,
      checkin,
      checkout,
      pessoas,
      estado_reserva,
      preco,
      tipo_pagamento,
      pagamento_realizado,
      obs,
    } = values;

    if (
      !quarto_id ||
      !cliente_id ||
      !checkin ||
      !checkout ||
      !pessoas ||
      !estado_reserva ||
      !preco ||
      !tipo_pagamento ||
      !pagamento_realizado ||
      !obs
    ) {
      setFormError("Preencha todos os campos");
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("reservas")
      .insert({
        cliente_id,
        estado_reserva,
        checkin,
        checkout,
        pessoas,
        quarto_id,
        preco,
        tipo_pagamento,
        pagamento_realizado,
        obs,
      })
      .select()
      .single();

    if (error) {
      console.log(error);
      setFormError("Não conseguiu criar a reserva");
      return;
    }
    if (data) {
      console.log(data);

      // Atualiza o quarto para ocupado
      const hoje = new Date().toISOString().split("T")[0];
      if (hoje >= checkin && hoje <= checkout) {
        await supabase
          .from("quartos")
          .update({ ocupado: "sim" })
          .eq("id", quarto_id);
      } else {
        await supabase
          .from("quartos")
          .update({ ocupado: "nao" })
          .eq("id", quarto_id);
      }

      // Cria entrada financeira automaticamente
      await supabase.from("financeiro").insert({
        valor: preco,
        tipo_transacao: "Entrada",
        metodo: tipo_pagamento,
        data_transacao: checkin,
        origem: "Reserva",
        reserva_id: data.id,
      });

      setFormError(null);
      router.push("/reservas");
      router.refresh();
    }
  };

  return (
    <div className="criar-reserva">
      <div className="header-pages">
        <h2>Criar Reserva</h2>
      </div>
      <p className="text-center">Preencha o fomulário seguindo a ordem:</p>
      <ReservaForm
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isUpdate={false}
        formError={formError}
        clientesList={clientesList}
        quartosList={quartosList}
        reservasList={reservasList}
      />
    </div>
  );
};

const CriarFinanceiro = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    valor: "",
    tipo_transacao: "",
    metodo: "",
    data_transacao: "",
    origem: "",
  });
  const [formError, setFormError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  // Estado de recorrência
  const [recorrencia, setRecorrencia] = useState({
    ativa: false,
    intervalo: 1,
    periodo: "meses",
    termino: "repetir",
    vezes: 12,
  });

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleRecorrenciaChange = (key, value) => {
    setRecorrencia((prev) => ({ ...prev, [key]: value }));
  };

  // Função para calcular a próxima data
  const calcularProximaData = (dataBase, intervalo, periodo, multiplicador) => {
    const data = new Date(dataBase);
    const intervaloTotal = intervalo * multiplicador;

    switch (periodo) {
      case "dias":
        data.setDate(data.getDate() + intervaloTotal);
        break;
      case "semanas":
        data.setDate(data.getDate() + intervaloTotal * 7);
        break;
      case "meses":
        data.setMonth(data.getMonth() + intervaloTotal);
        break;
      case "anos":
        data.setFullYear(data.getFullYear() + intervaloTotal);
        break;
    }

    return data.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { valor, tipo_transacao, metodo, data_transacao, origem } = values;

    if (!valor || !tipo_transacao || !metodo || !data_transacao || !origem) {
      setFormError("Preencha todos os campos");
      return;
    }

    setIsPending(true);
    const supabase = createClient();

    // Se recorrência ativa, cria múltiplas transações
    if (recorrencia.ativa) {
      const quantidade =
        recorrencia.termino === "nunca" ? 12 : Number(recorrencia.vezes);
      const transacoes = [];

      for (let i = 0; i < quantidade; i++) {
        const novaData = calcularProximaData(
          data_transacao,
          Number(recorrencia.intervalo),
          recorrencia.periodo,
          i,
        );
        transacoes.push({
          valor,
          tipo_transacao,
          metodo,
          data_transacao: novaData,
          origem,
        });
      }

      const { data, error } = await supabase
        .from("financeiro")
        .insert(transacoes)
        .select();

      if (error) {
        console.log(error);
        setFormError("Não conseguiu criar as transações");
        setIsPending(false);
        return;
      }
      if (data) {
        console.log(`${data.length} transações criadas`);
        setFormError(null);
        router.push("/financeiro");
        router.refresh();
      }
    } else {
      // Criação única (comportamento original)
      const { data, error } = await supabase
        .from("financeiro")
        .insert({ valor, tipo_transacao, metodo, data_transacao, origem })
        .select();

      if (error) {
        console.log(error);
        setFormError("Não conseguiu criar a transição");
        setIsPending(false);
        return;
      }
      if (data) {
        console.log(data);
        setFormError(null);
        router.push("/financeiro");
        router.refresh();
      }
    }
  };

  return (
    <div className="criar-financeiro">
      <div className="header-pages">
        <h2>Criar Transação</h2>
      </div>
      <FinanceiroForm
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isUpdate={false}
        isPending={isPending}
        formError={formError}
        recorrencia={recorrencia}
        onRecorrenciaChange={handleRecorrenciaChange}
      />
    </div>
  );
};

export { CriarQuarto, CriarCliente, CriarReserva, CriarFinanceiro };
