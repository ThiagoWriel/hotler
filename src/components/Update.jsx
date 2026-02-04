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
import FinanceiroSummaryCard from "./FinanceiroSummaryCard";
import ReservaSummaryCard from "./ReservaSummaryCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

    if (!nome) {
      setFormError("Preencha o nome do cliente");
      return;
    }

    setIsPending(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("clientes")
      .update({
        nome,
        cpf: cpf ? cpf.replace(/\D/g, "") : null,
        telefone: telefone ? telefone.replace(/\D/g, "") : null,
        nascimento: nascimento || null,
        obs: obs || null,
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
  const [originalDates, setOriginalDates] = useState({
    checkin: "",
    checkout: "",
  });
  const [formError, setFormError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [showDateAlert, setShowDateAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const [clientesList, setClientesList] = useState([]);
  const [quartosList, setQuartosList] = useState([]);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  // Verifica se as datas foram alteradas
  const datesChanged = () => {
    return (
      values.checkin !== originalDates.checkin ||
      values.checkout !== originalDates.checkout
    );
  };

  // Função que realmente faz o submit
  const doSubmit = async () => {
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

    // Se as datas foram alteradas, mostra o alerta
    if (datesChanged()) {
      setShowDateAlert(true);
      return;
    }

    // Se não mudou, faz o submit normal
    await doSubmit();
  };

  // Função para excluir a reserva
  const handleDelete = async () => {
    setIsPending(true);
    const supabase = createClient();
    const { error } = await supabase.from("reservas").delete().eq("id", id);

    if (error) {
      setFormError("Erro ao excluir reserva");
      setIsPending(false);
      return;
    }

    router.push("/reservas");
    router.refresh();
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
        // Guarda os valores originais das datas
        setOriginalDates({
          checkin: data.checkin,
          checkout: data.checkout,
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
      <div className="form-with-summary">
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
        <ReservaSummaryCard
          values={values}
          clientesList={clientesList}
          quartosList={quartosList}
        />
      </div>

      {/* AlertDialog para confirmar alteração de datas */}
      <AlertDialog open={showDateAlert} onOpenChange={setShowDateAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Datas Alteradas</AlertDialogTitle>
            <AlertDialogDescription>
              Você alterou as datas de check-in ou check-out. Tem certeza que
              atualizou o preço da reserva antes de confirmar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={doSubmit}>
              Sim, confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog para confirmar exclusão */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Reserva</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta reserva? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="delete-action">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Botão de excluir reserva */}
      <div className="delete-reserva-container">
        <button
          type="button"
          className="delete-reserva-button"
          onClick={() => setShowDeleteAlert(true)}
          disabled={isPending}
        >
          <i className="material-icons">delete</i>
          Excluir Reserva
        </button>
      </div>
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
      <div className="form-with-summary">
        <FinanceiroForm
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isUpdate={true}
          isPending={isPending}
          formError={formError}
        />
        <FinanceiroSummaryCard values={values} />
      </div>
    </div>
  );
};

export { UpdateQuarto, UpdateCliente, UpdateReserva, UpdateFinanceiro };
