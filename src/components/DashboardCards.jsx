import { DashboardCard } from "./Card";

export function DashboardCards({ quartos, reservas }) {
  // Calculos Dashboard
  const pessoasHospedadas = reservas
    ? reservas
        .filter((r) => r.estado_reserva === "Confirmada")
        .reduce((acc, r) => acc + (parseInt(r.pessoas) || 0), 0)
    : 0;

  const pagamentos_nao_realizados = reservas
    ? reservas.filter((r) => r.pagamento_realizado === "Não").length
    : 0;

  const quartosDisponiveis = quartos
    ? quartos.filter((q) => q.estado === "limpo" && q.ocupado === "não").length
    : 0;

  const quartosSujos = quartos
    ? quartos.filter((q) => q.estado === "sujo" || q.estado === "Sujo").length
    : 0;

  const quartosOcupados = quartos
    ? quartos.filter((q) => q.ocupado === "sim").length
    : 0;

  const reservasAtivas = reservas
    ? reservas.filter((r) => r.estado_reserva === "Confirmada").length
    : 0;

  const totalQuartos = quartos ? quartos.length : 0;
  const ocupacao =
    totalQuartos > 0 ? (quartosOcupados / totalQuartos) * 100 : 0;

  return (
    <div className="dashboard-cards">
      <DashboardCard
        dashboard={{
          title: "Ocupação",
          value: ocupacao.toFixed(0) + "%",
          icon: "pie_chart",
        }}
      />
      <DashboardCard
        dashboard={{
          title: "Quartos Ocupados",
          value: quartosOcupados,
          icon: "meeting_room",
        }}
      />
      <DashboardCard
        dashboard={{
          title: "Quartos Disponíveis",
          value: quartosDisponiveis,
          icon: "meeting_room",
        }}
      />
      <DashboardCard
        dashboard={{
          title: "Quartos Sujos",
          value: quartosSujos,
          icon: "cleaning_services",
        }}
      />
      <DashboardCard
        dashboard={{
          title: "Pessoas Hospedadas",
          value: pessoasHospedadas,
          icon: "groups",
        }}
      />
      <DashboardCard
        dashboard={{
          title: "Reservas Ativas",
          value: reservasAtivas,
          icon: "event_note",
        }}
      />
      <DashboardCard
        dashboard={{
          title: "Pagamentos a receber",
          value: pagamentos_nao_realizados,
          icon: "payment",
        }}
      />
      <DashboardCard
        dashboard={{
          title: "Check-in Hoje",
          value: reservas.filter(
            (reserva) =>
              reserva.checkin === new Date().toISOString().split("T")[0],
          ).length,
          icon: "login",
        }}
      />
      <DashboardCard
        dashboard={{
          title: "Check-out Hoje",
          value: reservas.filter(
            (reserva) =>
              reserva.checkout === new Date().toISOString().split("T")[0],
          ).length,
          icon: "logout",
        }}
      />
    </div>
  );
}
