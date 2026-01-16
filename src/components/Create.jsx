"use client";

import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import { useRouter } from "next/navigation";
import { QuartoForm, ClienteForm, ReservaForm, FinanceiroForm } from "./Forms";

const CriarQuarto = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    numero: "",
    tipo: "",
    estado: "",
    ocupado: "",
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
    cpf: "",
    telefone: "",
    nascimento: "",
    obs: "",
  });
  const [formError, setFormError] = useState(null);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nome, cpf, telefone, nascimento, obs } = values;

    if (!nome || !cpf || !telefone || !nascimento || !obs) {
      setFormError("Preencha todos os campos");
      return;
    }

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
    quarto_reserva: "",
    cliente_reserva: "",
    checkin: "",
    checkout: "",
    pessoas: "",
    estado_reserva: "",
    preco: "",
    tipo_pagamento: "",
    pagamento_realizado: "",
    obs: "",
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
        ...(quartoParam && { quarto_reserva: quartoParam }),
        ...(checkinParam && { checkin: checkinParam }),
      }));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: clientesData } = await supabase
        .from("clientes")
        .select("nome");
      if (clientesData) setClientesList(clientesData);

      const { data: quartosData } = await supabase
        .from("quartos")
        .select("numero, estado, ocupado");
      if (quartosData) setQuartosList(quartosData);

      const { data: reservasData } = await supabase
        .from("reservas")
        .select("quarto_reserva, checkin, checkout, estado_reserva")
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
    } = values;

    if (
      !quarto_reserva ||
      !cliente_reserva ||
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

    const { data, error } = await supabase
      .from("reservas")
      .insert({
        cliente_reserva,
        estado_reserva,
        checkin,
        checkout,
        pessoas,
        quarto_reserva,
        preco,
        tipo_pagamento,
        pagamento_realizado,
        obs,
      })
      .select();

    if (error) {
      console.log(error);
      setFormError("Não conseguiu criar a reserva");
      return;
    }
    if (data) {
      console.log(data);

      // Atualiza o quarto para ocupado
      const { data: quartoData } = await supabase
        .from("quartos")
        .select("id")
        .eq("numero", quarto_reserva)
        .single();

      if (quartoData) {
        await supabase
          .from("quartos")
          .update({ ocupado: "sim" })
          .eq("id", quartoData.id);
      }

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

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { valor, tipo_transacao, metodo, data_transacao, origem } = values;

    if (!valor || !tipo_transacao || !metodo || !data_transacao || !origem) {
      setFormError("Preencha todos os campos");
      return;
    }

    const { data, error } = await supabase
      .from("financeiro")
      .insert({ valor, tipo_transacao, metodo, data_transacao, origem })
      .select();

    if (error) {
      console.log(error);
      setFormError("Não conseguiu criar a transição");
      return;
    }
    if (data) {
      console.log(data);
      setFormError(null);
      router.push("/financeiro");
      router.refresh();
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
        formError={formError}
      />
    </div>
  );
};

export { CriarQuarto, CriarCliente, CriarReserva, CriarFinanceiro };
