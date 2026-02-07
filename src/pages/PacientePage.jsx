function PacientePage({
  pacienteSelecionado,
  agendamentos,
  setPacienteSelecionado,
  setTela
}) {
  // lista única de pacientes
  const pacientes = [...new Set(agendamentos.map(a => a.paciente))];

  const historico = pacienteSelecionado
    ? agendamentos.filter(a => a.paciente === pacienteSelecionado)
    : [];

  return (
    <div className="pacientes-container">
      <h2>Pacientes</h2>

      <div className="pacientes-grid">
        {/* Lista de pacientes */}
        <div className="pacientes-lista">
          <h3>Pacientes</h3>

          {pacientes.length === 0 && (
            <p className="vazio">Nenhum paciente cadastrado</p>
          )}

          {pacientes.map((p, i) => (
            <button
              key={i}
              className={`paciente-item ${
                pacienteSelecionado === p ? "ativo" : ""
              }`}
              onClick={() => setPacienteSelecionado(p)}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Histórico */}
        <div className="paciente-detalhes">
          <h3>Histórico</h3>

          {!pacienteSelecionado && (
            <p className="vazio">Selecione um paciente</p>
          )}

          {historico.map((a, i) => (
            <div key={i} className="historico-item">
              <strong>{a.data}</strong> — {a.hora}
              <br />
              {a.profissional} ({a.tipo})
            </div>
          ))}
        </div>
      </div>

      <button className="btn-primario" onClick={() => setTela("agenda")}>
        ← Voltar
      </button>
    </div>
  );
}

export default PacientePage;
