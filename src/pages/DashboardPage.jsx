export default function DashboardPage({
  totalAgendamentos = 0,
  taxaOcupacao = 0,
  atendimentosPorTipo = {}
}) {
  return (
    <div className="card destaque">
      <h2>📈 Dashboard</h2>

      <p>
        <strong>Total de atendimentos no mês:</strong>{" "}
        {totalAgendamentos}
      </p>

      <p>
        <strong>Taxa de ocupação:</strong>{" "}
        {taxaOcupacao}%
      </p>

      <h3>Atendimentos por tipo</h3>

      {Object.keys(atendimentosPorTipo).length === 0 ? (
        <p>Nenhum atendimento registrado.</p>
      ) : (
        <ul>
          {Object.entries(atendimentosPorTipo).map(
            ([tipo, total]) => (
              <li key={tipo}>
                {tipo}: {total}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
