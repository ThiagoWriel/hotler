import { Link } from "react-router-dom";

const CreateButtonQuarto = () => {
  return (
    <div className="create-button-container">
      <Link to="/quartos/create">
        <button className="create-button">Adicionar Quarto</button>
      </Link>
    </div>
  );
};

const CreateButtonCliente = () => {
  return (
    <div className="create-button-container">
      <Link to="/clientes/create">
        <button className="create-button">Adicionar Cliente</button>
      </Link>
    </div>
  );
};

export { CreateButtonQuarto, CreateButtonCliente };
