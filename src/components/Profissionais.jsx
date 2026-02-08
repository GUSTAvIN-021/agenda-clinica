function Profissionais({
  profissionais,
  nomeProf,
  setNomeProf,
  tipoProf,
  setTipoProf,
  diasProf,
  setDiasProf,
  salvarProfissional,
  excluirProfissional,
  setTela
}) {
  const diasSemana = [
    { label: "Seg", valor: 1 },
    { label: "Ter", valor: 2 },
    { label: "Qua", valor: 3 },
    { label: "Qui", valor: 4 },
    { label: "Sex", valor: 5 }
  ];

  return (
    <div className="profissionais-container">
      <h2>Profissionais</h2>

      <div className="form-profissional">
        <input
          placeholder="Nome do profissional"
          value={nomeProf}
          onChange={e => setNomeProf(e.target.value)}
        />

        <input
          placeholder="Tipo (Psicólogo, Fono, etc)"
          value={tipoProf}
          onChange={e => setTipoProf(e.target.value)}
        />

        <div className="dias">
          {diasSemana.map(dia => (
            <label key={dia.valor} className="dia-checkbox">
              <input
                type="checkbox"
                checked={diasProf.includes(dia.valor)}
                onChange={() =>
                  setDiasProf(prev =>
                    prev.includes(dia.valor)
                      ? prev.filter(d => d !== dia.valor)
                      : [...prev, dia.valor]
                  )
                }
              />
              {dia.label}
            </label>
          ))}
        </div>

        <button className="btn-principal" onClick={salvarProfissional}>
          Adicionar Profissional
        </button>
      </div>

      <h3>Profissionais cadastrados</h3>

      <div className="lista-profissionais">
        {profissionais.length === 0 && (
          <p className="vazio">Nenhum profissional cadastrado.</p>
        )}

        {profissionais.map((p, i) => (
          <div key={i} className="prof-card">
            <div className="prof-info">
              <strong>{p.nome}</strong>
              <span>{p.tipo}</span>
              <small>Dias: {p.diasAtendimento.join(", ")}</small>
            </div>

            <button
              className="btn-excluir"
              onClick={() => excluirProfissional(i)}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>

      <button className="btn-voltar" onClick={() => setTela("agenda")}>
        Voltar
      </button>
    </div>
  );
}

export default Profissionais;
