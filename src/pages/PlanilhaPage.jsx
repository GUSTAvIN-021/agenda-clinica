export default function PlanilhaPage({
  diaPlanilha,
  setDiaPlanilha,
  profissionais,
  HORARIOS,
  getAgendamento
}) {
  if (!Array.isArray(profissionais) || profissionais.length === 0) {
    return (
      <div className="card aviso">
        <p>Nenhum profissional cadastrado.</p>
      </div>
    );
  }

  if (!Array.isArray(HORARIOS) || HORARIOS.length === 0) {
    return (
      <div className="card aviso">
        <p>Horários não configurados.</p>
      </div>
    );
  }

  if (typeof getAgendamento !== "function") {
    return (
      <div className="card aviso">
        <p>Erro interno: função de agendamento não disponível.</p>
      </div>
    );
  }

  return (
    <div className="card destaque">
      <h2>Visão Geral por Profissional</h2>

      <input
        type="date"
        value={diaPlanilha || ""}
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
