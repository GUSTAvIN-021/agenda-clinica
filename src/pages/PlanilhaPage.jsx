export default function PlanilhaPage({
  diaPlanilha,
  setDiaPlanilha,
  profissionais,
  HORARIOS,
  getAgendamento
}) {
  return (
    <div className="card destaque">
      <h2>Visão Geral por Profissional</h2>

      <input
        type="date"
        value={diaPlanilha}
        onChange={(e) => setDiaPlanilha(e.target.value)}
      />

      {!diaPlanilha && <p>Selecione um dia para visualizar.</p>}

      {diaPlanilha && (
        <div className="tabela-wrapper">
          <table className="tabela-planilha">
            <thead>
              <tr>
                <th>Horário</th>
                {profissionais.map((p, i) => (
                  <th key={i}>
                    {p.nome}
                    <br />
                    <small>{p.tipo}</small>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {HORARIOS.map((hora, i) => (
                <tr key={i}>
                  <td className="hora-col">{hora}</td>

                  {profissionais.map((p, j) => {
                    const ag = getAgendamento(diaPlanilha, hora, p);

                    return (
                      <td
                        key={j}
                        className={ag ? "celula-ocupada" : "celula-livre"}
                      >
                        {ag ? (
                          <>
                            <strong>{ag.paciente}</strong>
                            <br />
                            <small>{ag.tipo}</small>
                          </>
                        ) : (
                          "Livre"
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
