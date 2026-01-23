import { createClient } from "@/lib/supabase/client";

// Verifica se o quarto tem reserva no dia atual
const verificarReservaAtual = (quarto, reservas) => {
  const hoje = new Date().toISOString().split("T")[0];

  return reservas.some((reserva) => {
    if (
      reserva.quarto_id === quarto.id &&
      reserva.estado_reserva !== "Cancelada" &&
      reserva.estado_reserva !== "Finalizada"
    ) {
      const checkin = reserva.checkin;
      const checkout = reserva.checkout;

      return hoje >= checkin && hoje <= checkout;
    }
    return false;
  });
};

// Calcula o status de ocupado baseado nas reservas
const calcularOcupado = (quarto, reservas) => {
  return verificarReservaAtual(quarto, reservas) ? "sim" : "não";
};

// Calcula o estado (limpo/sujo) baseado no ocupado e nas reservas
const calcularEstado = (quarto, reservas) => {
  const temReservaAtual = verificarReservaAtual(quarto, reservas);
  // Mantém o estado atual se tiver reserva ativa
  return quarto.estado;
};

// Atualiza o status do quarto no banco
export const atualizarStatusQuarto = async (quarto, reservas) => {
  const ocupadoNovo = calcularOcupado(quarto, reservas);
  const estadoNovo = calcularEstado(quarto, reservas);

  // Só atualiza se houver mudança
  if (quarto.ocupado !== ocupadoNovo || quarto.estado !== estadoNovo) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("quartos")
      .update({
        ocupado: ocupadoNovo,
        estado: estadoNovo,
      })
      .eq("id", quarto.id)
      .select();

    if (error) {
      console.log("Erro ao atualizar status do quarto:", error);
      return null;
    }

    return data;
  }

  return quarto;
};

// Processa o status de display para visualização (não salva no banco)
export const processarStatusQuarto = (quarto, reservas) => {
  const ocupadoNovo = calcularOcupado(quarto, reservas);
  const estadoNovo = calcularEstado(quarto, reservas);

  return {
    ...quarto,
    ocupado: ocupadoNovo,
    estado: estadoNovo,
  };
};

// Atualiza todos os quartos baseado nas reservas
export const atualizarTodosQuartos = async (quartos, reservas) => {
  const promises = quartos.map((quarto) =>
    atualizarStatusQuarto(quarto, reservas),
  );
  return await Promise.all(promises);
};
