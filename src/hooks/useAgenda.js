import { getDiaSemana, gerarProximosDias } from "../utils/agendaUtils";

export function useAgenda({
  agendamentos,
  setAgendamentos,
  profissionais,
  profissional,
  paciente,
  data,
  filtroData,
  hora,
  HORARIOS
}) {

  /* ============================
     ADICIONAR AGENDAMENTO
  ============================ */
  const adicionar = () => {
    if (!paciente || !data || !hora || !profissional) return false;

    const ocupado = agendamentos.some(
      (a) =>
        a.data === data &&
        a.hora === hora &&
        a.profissional === profissional.nome
    );

    if (ocupado) return false;

    setAgendamentos([
      ...agendamentos,
      {
        paciente,
        data,
        hora,
        profissional: profissional.nome,
        tipo: profissional.tipo
      }
    ]);

    return true;
  };

  /* ============================
     EXCLUIR AGENDAMENTO
  ============================ */
  const excluirHorario = (index) => {
    setAgendamentos(
      agendamentos.filter((_, i) => i !== index)
    );
  };

  /* ============================
     AGENDAMENTOS DO DIA
  ============================ */
  const agendamentosDoDia = filtroData
    ? agendamentos.filter((a) => a.data === filtroData)
    : [];

  /* ============================
     HORÁRIOS DO DIA
  ============================ */
  const horariosOcupados = agendamentos
    .filter(
      (a) =>
        a.data === filtroData &&
        a.profissional === profissional?.nome
    )
    .map((a) => a.hora);

  const horariosDoDia = HORARIOS.map((h) => ({
    hora: h,
    ocupado: horariosOcupados.includes(h)
  }));

  /* ============================
     RESUMO DOS PRÓXIMOS DIAS
  ============================ */
  const proximosDias = gerarProximosDias();

  const resumoDias = proximosDias.map((dia) => {
    const diaSemana = getDiaSemana(dia);

    const profissionaisNoDia = profissionais.filter((p) =>
      p.diasAtendimento.includes(diaSemana)
    );

    const totalPossivel =
      profissionaisNoDia.length * HORARIOS.length;

    const ocupados = agendamentos.filter(
      (a) => a.data === dia
    ).length;

    return {
      dia,
      livres: totalPossivel - ocupados,
      ocupados
    };
  });

  /* ============================
     RETORNO DO HOOK
  ============================ */
  return {
    adicionar,
    excluirHorario,
    agendamentosDoDia,
    horariosDoDia,
    resumoDias
  };
}
