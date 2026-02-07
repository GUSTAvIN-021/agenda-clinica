export function useDashboard(agendamentos, horarios) {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  const agendamentosDoMes = agendamentos.filter(a => {
    const data = new Date(a.data);
    return (
      data.getMonth() === mesAtual &&
      data.getFullYear() === anoAtual
    );
  });

  const totalAgendamentos = agendamentosDoMes.length;

  const diasUnicos = new Set(
    agendamentosDoMes.map(a => a.data)
  );

  const totalHorariosPossiveis =
    diasUnicos.size * horarios.length;

  const taxaOcupacao = totalHorariosPossiveis
    ? Math.round(
        (totalAgendamentos / totalHorariosPossiveis) * 100
      )
    : 0;

  const atendimentosPorTipo = agendamentosDoMes.reduce(
    (acc, a) => {
      acc[a.tipo] = (acc[a.tipo] || 0) + 1;
      return acc;
    },
    {}
  );

  return {
    totalAgendamentos: totalAgendamentos || 0,
    taxaOcupacao: taxaOcupacao || 0,
    atendimentosPorTipo: atendimentosPorTipo || {}
  };

}
