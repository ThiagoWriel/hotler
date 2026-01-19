import Link from "next/link";
import { Button } from "@/components/ui/button";

const CreateButtonQuarto = () => {
  return (
    <Link href="/quartos/create">
      <Button>Adicionar Quarto</Button>
    </Link>
  );
};

const CreateButtonCliente = () => {
  return (
    <Link href="/clientes/create">
      <Button>Adicionar Cliente</Button>
    </Link>
  );
};

const CreateButtonReserva = () => {
  return (
    <Link href="/reservas/create">
      <Button>Adicionar Reserva</Button>
    </Link>
  );
};

const CreateButtonFinanceiro = () => {
  return (
    <Link href="/financeiro/create">
      <Button>Adicionar Movimentação</Button>
    </Link>
  );
};

export {
  CreateButtonQuarto,
  CreateButtonCliente,
  CreateButtonReserva,
  CreateButtonFinanceiro,
};
