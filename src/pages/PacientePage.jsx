export default function PacientePage({
  pacienteSelecionado,
  agendamentos,
  setTela
}) {
  const atendimentos = agendamentos.filter(
    (a) => a.paciente === pacienteSelecionado
  );

  // 🔹 Agrupar atendimentos por tipo
  const atendimentosPorTipo = atendimentos.reduce((acc, a) => {
    if (!acc[a.tipo]) acc[a.tipo] = [];
    acc[a.tipo].push(a);
    return acc;
  }, {});

  return (
    <div className="card">
      <button onClick={() => setTela("agenda")}>⬅ Voltar</button>

      <h2>Paciente</h2>
      <h3>{pacienteSelecionado}</h3>

      {atendimentos.length === 0 ? (
        <p>Nenhum atendimento registrado.</p>
      ) : (
        <>
          <p>
            <strong>Total de atendimentos:</strong>{" "}
            {atendimentos.length}
          </p>

          {Object.entries(atendimentosPorTipo).map(
            ([tipo, lista]) => (
              <div key={tipo} className="card destaque">
                <h4>
                  {tipo} ({lista.length})
                </h4>

                <table className="tabela">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Hora</th>
                      <th>Profissional</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lista.map((a, i) => (
                      <tr key={i}>
                        <td>
                          {a.data
                            .split("-")
                            .reverse()
                            .join("/")}
                        </td>
                        <td>{a.hora}</td>
                        <td>{a.profissional}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
