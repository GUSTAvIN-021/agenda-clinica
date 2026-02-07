function Profissionais({
  profissionais,
  nomeProf,
  setNomeProf,
  tipoProf,
  setTipoProf,
  diasProf,
  setDiasProf,
  salvarProfissional,
  setTela
}) {
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
          {["Seg", "Ter", "Qua", "Qui", "Sex"].map(dia => (
            <label key={dia} className="dia-checkbox">
              <input
                type="checkbox"
                checked={diasProf.includes(dia)}
                onChange={() =>
                  setDiasProf(prev =>
                    prev.includes(dia)
                      ? prev.filter(d => d !== dia)
                      : [...prev, dia]
                  )
                }
              />
              {dia}
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
            <strong>{p.nome}</strong>
            <span>{p.tipo}</span>
            <small>Dias: {p.diasAtendimento.join(", ")}</small>
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
