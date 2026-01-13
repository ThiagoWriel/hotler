import Link from "next/link";

const CreateButtonQuarto = () => {
  return (
    <div className="create-button-container">
      <Link href="/quartos/create">
        <button className="create-button">Adicionar Quarto</button>
      </Link>
    </div>
  );
};

const CreateButtonCliente = () => {
  return (
    <div className="create-button-container">
      <Link href="/clientes/create">
        <button className="create-button">Adicionar Cliente</button>
      </Link>
    </div>
  );
};

const CreateButtonReserva = () => {
  return (
    <div className="create-button-container">
      <Link href="/reservas/create">
        <button className="create-button">Adicionar Reserva</button>
      </Link>
    </div>
  );
};

const CreateButtonFinanceiro = () => {
  return (
    <div className="create-button-container">
      <Link href="/financeiro/create">
        <button className="create-button">Adicionar Movimentação</button>
      </Link>
    </div>
  );
};

export {
  CreateButtonQuarto,
  CreateButtonCliente,
  CreateButtonReserva,
  CreateButtonFinanceiro,
};
