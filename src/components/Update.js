import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

const UpdateQuarto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [numero, setNumero] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");
  const [ocupado, setOcupado] = useState("");
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!numero || !tipo || !estado || !ocupado) {
      setFormError("Preencha todos os campos");
      return;
    }

    const { data, error } = await supabase
      .from("quartos")
      .update({ numero, tipo, estado, ocupado })
      .eq("id", id)
      .select();

    if (error) {
      setFormError("Erro ao atualizar");
    }
    if (data) {
      setFormError(null);
      navigate("/quartos");
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
        navigate("/quartos", { replace: true });
      }
      if (data) {
        setNumero(data.numero);
        setTipo(data.tipo);
        setEstado(data.estado);
        setOcupado(data.ocupado);
      }
    };
    fetchQuarto();
  }, [id, navigate]);

  return (
    <div className="page financeiro">
      <h2>Editar Quarto {id}</h2>
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
        <button type="submit">Atualizar Quarto</button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
};

const UpdateCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [obs, setObs] = useState("");
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !cpf || !telefone || !nascimento || !obs) {
      setFormError("Preencha todos os campos");
      return;
    }

    const { data, error } = await supabase
      .from("clientes")
      .update({ nome, cpf, telefone, nascimento, obs })
      .eq("id", id)
      .select();

    if (error) {
      setFormError("Erro ao atualizar");
    }
    if (data) {
      setFormError(null);
      navigate("/clientes");
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
        navigate("/clientes", { replace: true });
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
  }, [id, navigate]);

  return (
    <div className="page financeiro">
      <h2>Editar Cliente {id}</h2>
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

        <button type="submit">Atualizar Cliente</button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
};

export { UpdateQuarto, UpdateCliente };
