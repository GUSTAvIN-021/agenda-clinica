export default function AgendaPage({
  agendamentos,
  setAgendamentos,
  pacientes,
  setPaciente,
  paciente,
  data,
  setData,
  hora,
  setHora,
  filtroData,
  setFiltroData,
  profissional,
  setProfissional,
  profissionais,
  profissionaisDisponiveis,
  HORARIOS,
  horariosDoDia,
  agendamentosDoDia,
  excluirHorario,
  resumoDias,
  nomeDiaSemana,
  totalAgendamentos,
  taxaOcupacao,
  atendimentosPorTipo,
  historicoPaciente,
  adicionar,
  setTela,
  setPacienteSelecionado
}) {
  return (
    <>
      {/* DASHBOARD */}
      <div className="card destaque">
        <h2>Resumo do Mês</h2>

        <div className="dashboard">
          <div className="dashboard-item azul">
            <strong>{totalAgendamentos}</strong>
            <span>Atendimentos no mês</span>
          </div>

          <div className="dashboard-item amarelo">
            <strong>{taxaOcupacao}%</strong>
            <span>Taxa de ocupação</span>
          </div>

          <div className="dashboard-item rosa">
            <strong>{Object.keys(atendimentosPorTipo).length}</strong>
            <span>Tipos de atendimento</span>
          </div>
        </div>

        <h3>Atendimentos por tipo</h3>
        <ul>
          {Object.entries(atendimentosPorTipo).map(([tipo, qtd]) => (
            <li key={tipo}>
              {tipo}: {qtd}
            </li>
          ))}
        </ul>
      </div>

      {/* VISÃO GERAL DOS DIAS */}
      <div className="card">
        <h2>Visão Geral da Agenda</h2>

        <ul className="resumo-dias">
          {resumoDias.map((d, i) => (
            <li
              key={i}
              onClick={() => {
                setFiltroData(d.dia);
                setData(d.dia);
                setHora("");
              }}
              className={`dia-resumo ${
                d.livres === 0
                  ? "lotado"
                  : d.livres <= 2
                  ? "quase-cheio"
                  : d.livres <= 4
                  ? "poucas-vagas"
                  : "muitas-vagas"
              }`}
            >
              <strong>
                {nomeDiaSemana(d.dia)} •{" "}
                {d.dia.split("-").reverse().join("/")}
              </strong>

              <span>✅ Livres: {d.livres}</span>
              <br />
              <span>❌ Ocupados: {d.ocupados}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* NOVO AGENDAMENTO */}
      <div className="card">
        <h2>Novo Agendamento</h2>

        <p>
          <strong>Data:</strong> {data || "Selecione um dia"} <br />
          <strong>Horário:</strong> {hora || "Selecione um horário"}
        </p>

        <input
          placeholder="Nome do paciente"
          value={paciente}
          onChange={(e) => setPaciente(e.target.value)}
        />

        {historicoPaciente.length > 0 && (
          <div className="card aviso">
            <strong>Atendimentos já cadastrados:</strong>
            <ul>
              {historicoPaciente.map((a, i) => (
                <li key={i}>
                  {a.tipo} – {a.data} às {a.hora}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data && (
          <select
            value={profissional?.nome || ""}
            onChange={(e) => {
              const selecionado = profissionaisDisponiveis.find(
                (p) => p.nome === e.target.value
              );
              setProfissional(selecionado);
              setHora("");
            }}
          >
            <option value="">Selecione o profissional</option>

            {profissionaisDisponiveis.map((p, i) => {
              const ocupados = agendamentos.filter(
                (a) =>
                  a.data === data && a.profissional === p.nome
              ).length;

              const livres = HORARIOS.length - ocupados;

              return (
                <option key={i} value={p.nome} disabled={livres === 0}>
                  {p.nome} ({p.tipo}) –{" "}
                  {livres === 0 ? "Sem vagas" : `${livres} vagas`}
                </option>
              );
            })}
          </select>
        )}

        <button onClick={adicionar}>Salvar</button>
      </div>

      {/* HORÁRIOS */}
      <div className="card">
        <h2>Horários do Dia</h2>

        {!profissional && <p>Selecione um profissional.</p>}
        {!filtroData && <p>Selecione um dia.</p>}

        {filtroData && profissional && (
          <ul className="lista-horarios">
            {horariosDoDia.map((h, i) => (
              <li
                key={i}
                className={
                  h.ocupado
                    ? "ocupado"
                    : h.hora === hora
                    ? "selecionado"
                    : "livre"
                }
                onClick={() => {
                  if (!h.ocupado) setHora(h.hora);
                }}
              >
                {h.hora} {h.ocupado ? "❌ Ocupado" : "✅ Livre"}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* LISTA DE AGENDAMENTOS */}
      <div className="card">
        <h2>Agendamentos</h2>

        <ul>
          {agendamentosDoDia.map((a, i) => (
            <li key={i} className="item-agenda">
              <div>
                <span>
                  {a.data} {a.hora}
                </span>
                <br />
                <strong
                    className="link-paciente"
                    onClick={() => {
                        setPacienteSelecionado(a.paciente);
                        setTela("paciente");
                    }}
                >
                    {a.paciente}
                </strong>

                <br />
                <small>
                  {a.tipo} • {a.profissional}
                </small>
              </div>

              <button
                className="btn-excluir"
                onClick={() => excluirHorario(i)}
              >
                Excluir horário
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
