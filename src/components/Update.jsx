"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  QuartoForm,
  ClienteForm,
  ReservaForm,
  FinanceiroForm,
  formatCPF,
  formatTelefone,
} from "./Forms";

const UpdateQuarto = () => {
  const { id } = useParams();
  const router = useRouter();

  const [values, setValues] = useState({
    numero: "",
    tipo: "",
    estado: "",
    ocupado: "",
  });
  const [formError, setFormError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleChange = (key, value) => {
    if (key === "ocupado") {
      // Se mudar ocupado para "não", automaticamente coloca estado como "limpo"
      setValues((prev) => ({
        ...prev,
        ocupado: value,
        estado: value === "não" ? "limpo" : prev.estado,
      }));
    } else {
      setValues((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { numero, tipo, estado, ocupado } = values;

    if (!numero || !tipo || !estado || !ocupado) {
      setFormError("Preencha todos os campos");
      return;
    }

    setIsPending(true);

    const supabase = createClient();
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
      const supabase = createClient();
      const { data, error } = await supabase
        .from("quartos")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        router.push("/quartos");
      }
      if (data) {
        setValues({
          numero: data.numero,
          tipo: data.tipo,
          estado: data.estado,
          ocupado: data.ocupado,
        });
      }
    };
    fetchQuarto();
  }, [id, router]);

  return (
    <div className="page-quartos">
      <div className="header-pages">
        <h2>Editar Quarto</h2>
      </div>
      <QuartoForm
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isUpdate={true}
        isPending={isPending}
        formError={formError}
      />
    </div>
  );
};

const UpdateCliente = () => {
  const { id } = useParams();
  const router = useRouter();

  const [values, setValues] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    nascimento: "",
    obs: "",
  });
  const [formError, setFormError] = useState(null);
  const [isPending, setIsPending] = useState(false);

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

    setIsPending(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("clientes")
      .update({
        nome,
        cpf: cpf.replace(/\D/g, ""),
        telefone: telefone.replace(/\D/g, ""),
        nascimento,
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
      router.push("/clientes");
      router.refresh();
      setIsPending(false);
    }
  };

  useEffect(() => {
    const fetchCliente = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("clientes")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        router.push("/clientes");
      }
      if (data) {
        setValues({
          nome: data.nome,
          cpf: formatCPF(String(data.cpf || "")),
          telefone: formatTelefone(String(data.telefone || "")),
          nascimento: data.nascimento,
          obs: data.obs,
        });
      }
    };
    fetchCliente();
  }, [id, router]);

  return (
    <div className="page-clientes">
      <div className="header-pages">
        <h2>Editar Cliente</h2>
      </div>
      <ClienteForm
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isUpdate={true}
        isPending={isPending}
        formError={formError}
      />
    </div>
  );
};

const UpdateReserva = () => {
  const { id } = useParams();
  const router = useRouter();

  const [values, setValues] = useState({
    quarto_id: "",
    cliente_id: "",
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
  const [isPending, setIsPending] = useState(false);

  const [clientesList, setClientesList] = useState([]);
  const [quartosList, setQuartosList] = useState([]);

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
      !pagamento_realizado
    ) {
      setFormError("Preencha todos os campos");
      return;
    }

    setIsPending(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("reservas")
      .update({
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
      const supabase = createClient();
      const { data, error } = await supabase
        .from("reservas")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        router.push("/reservas");
      }
      if (data) {
        setValues({
          quarto_id: data.quarto_id,
          cliente_id: data.cliente_id,
          checkin: data.checkin,
          checkout: data.checkout,
          pessoas: data.pessoas,
          estado_reserva: data.estado_reserva,
          preco: data.preco,
          tipo_pagamento: data.tipo_pagamento,
          pagamento_realizado: data.pagamento_realizado,
          obs: data.obs || "",
        });
      }

      // Fetch lists for dropdowns
      const { data: clientesData } = await supabase
        .from("clientes")
        .select("id, nome");
      if (clientesData) setClientesList(clientesData);

      const { data: quartosData } = await supabase
        .from("quartos")
        .select("id, numero");
      if (quartosData) setQuartosList(quartosData);
    };
    fetchReserva();
  }, [id, router]);

  return (
    <div className="page-reservas">
      <div className="header-pages">
        <h2>Editar Reserva #{id}</h2>
      </div>
      <ReservaForm
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isUpdate={true}
        isPending={isPending}
        formError={formError}
        clientesList={clientesList}
        quartosList={quartosList}
      />
    </div>
  );
};

const UpdateFinanceiro = () => {
  const { id } = useParams();
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

    setIsPending(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("financeiro")
      .update({ valor, tipo_transacao, metodo, data_transacao, origem })
      .eq("id", id)
      .select();

    if (error) {
      setFormError("Erro ao atualizar");
      setIsPending(false);
    }
    if (data) {
      setFormError(null);
      router.push("/financeiro");
      router.refresh();
      setIsPending(false);
    }
  };

  useEffect(() => {
    const fetchFinanceiro = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("financeiro")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        router.push("/financeiro");
      }
      if (data) {
        setValues({
          valor: data.valor,
          tipo_transacao: data.tipo_transacao,
          metodo: data.metodo,
          data_transacao: data.data_transacao,
          origem: data.origem,
        });
      }
    };
    fetchFinanceiro();
  }, [id, router]);

  return (
    <div className="page-financeiro">
      <div className="header-pages">
        <h2>Editar Financeiro</h2>
      </div>
      <FinanceiroForm
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isUpdate={true}
        isPending={isPending}
        formError={formError}
      />
    </div>
  );
};

export { UpdateQuarto, UpdateCliente, UpdateReserva, UpdateFinanceiro };
