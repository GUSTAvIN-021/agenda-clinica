import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [paciente, setPaciente] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const HORARIOS = ["08:00", "09:00", "10:00", "11:00","13:00", "14:00", "15:00", "16:00", "17:00"];
  const [profissional, setProfissional] = useState(null);
  const [profissionais, setProfissionais] = useState(() => {
    const salvo = localStorage.getItem("profissionais");
    return salvo ? JSON.parse(salvo) : [];
  });

  const [tela, setTela] = useState("agenda");


  const getDiaSemana = (data) => {
    return new Date(data + "T00:00:00").getDay();
  };

  const nomeDiaSemana = (data) => {
    const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return dias[getDiaSemana(data)];
  };


  const [nomeProf, setNomeProf] = useState("");
  const [tipoProf, setTipoProf] = useState("");
  const [diasProf, setDiasProf] = useState([]);

  const [diaPlanilha, setDiaPlanilha] = useState("");



  useEffect(() => {
    localStorage.setItem("profissionais", JSON.stringify(profissionais));
  }, [profissionais]);


  // 🔹 Carregar agendamentos ao abrir o site
  useEffect(() => {
    const dadosSalvos = localStorage.getItem("agendamentos");
    if (dadosSalvos) {
      setAgendamentos(JSON.parse(dadosSalvos));
    }
  }, []);

  // 🔹 Salvar sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
  }, [agendamentos]);

  const adicionar = () => {
  if (!paciente || !data || !hora || !profissional) {
    alert("Preencha todos os campos.");
    return;
  }

  const horarioOcupado = agendamentos.some(
    (a) =>
      a.data === data &&
      a.hora === hora &&
      a.profissional === profissional.nome
  );



  if (horarioOcupado) {
    alert("Este horário já está ocupado. Escolha outro.");
    return;
  }

  const novo = {
  paciente,
  data,
  hora,
  profissional: profissional.nome,
  tipo: profissional.tipo
  };

  setAgendamentos([...agendamentos, novo]);

  setPaciente("");
  setHora("");
  setProfissional(null);
};


  const excluirHorario = (index) => {
    const novaLista = agendamentos.filter((_, i) => i !== index);
    setAgendamentos(novaLista);
    localStorage.setItem("agendamentos", JSON.stringify(novaLista));
  };
  
  const agendamentosDoDia = filtroData
  ? agendamentos.filter((a) => a.data === filtroData)
  : agendamentos;
  
  const horariosOcupados = agendamentos
    .filter(
      (a) =>
        a.data === filtroData &&
        a.profissional === profissional?.nome
    )
    .map(a => a.hora);


  const horariosDoDia = HORARIOS.map(hora => ({
    hora,
    ocupado: horariosOcupados.includes(hora)
  }));


  const gerarProximosDias = (qtd = 7) => {
  const dias = [];
  const hoje = new Date();

  for (let i = 0; i < qtd; i++) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() + i);

    dias.push(d.toISOString().split("T")[0]);
  }

  return dias;
};

const proximosDias = gerarProximosDias();

const resumoDias = proximosDias.map((dia) => {
  const diaSemana = getDiaSemana(dia);

  const profissionaisNoDia = profissionais.filter(p =>
    p.diasAtendimento.includes(diaSemana)
  );


  const totalPossivel = profissionaisNoDia.length * HORARIOS.length;

  const ocupados = agendamentos.filter(a => a.data === dia).length;

  return {
    dia,
    livres: totalPossivel - ocupados,
    ocupados,
  };
});




  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  const agendamentosDoMes = agendamentos.filter(a => {
    const data = new Date(a.data);
    return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
  });

  const totalAgendamentos = agendamentosDoMes.length;

  const diasUnicos = new Set(agendamentosDoMes.map(a => a.data));
  const totalHorariosPossiveis = diasUnicos.size * HORARIOS.length;

  const taxaOcupacao = totalHorariosPossiveis
    ? Math.round((totalAgendamentos / totalHorariosPossiveis) * 100)
    : 0;

  const atendimentosPorTipo = agendamentosDoMes.reduce((acc, a) => {
    acc[a.tipo] = (acc[a.tipo] || 0) + 1;
    return acc;
  }, {});

  const adicionarProfissional = () => {
    if (!nomeProf || !tipoProf || diasProf.length === 0) {
      alert("Preencha todos os campos do profissional.");
      return;
    }

    const novo = {
      nome: nomeProf,
      tipo: tipoProf,
      diasAtendimento: diasProf
    };

    setProfissionais([...profissionais, novo]);

    setNomeProf("");
    setTipoProf("");
    setDiasProf([]);
  };


  const profissionaisDisponiveis = data
    ? profissionais.filter((p) =>
        p.diasAtendimento.includes(getDiaSemana(data))
      )
    : [];


  const getAgendamento = (dia, hora, profissional) => {
    return agendamentos.find(
      (a) =>
        a.data === dia &&
        a.hora === hora &&
        a.profissional === profissional.nome
    );
  };




  
  
  
  const historicoPaciente = paciente
    ? agendamentos.filter(a => a.paciente === paciente)
    : [];

  
   
  
  
  
  
  
  
    return (
    <div className="container">
      <h1>Agenda da Clínica</h1>

      <nav className="menu">

        <button
          className={tela === "planilha" ? "ativo" : ""}
          onClick={() => setTela("planilha")}
        >
          📊 Visão Planilha
        </button>


        <button
          className={tela === "agenda" ? "ativo" : ""}
          onClick={() => setTela("agenda")}
        >
          📅 Agendamentos
        </button>

        <button
          className={tela === "profissionais" ? "ativo" : ""}
          onClick={() => setTela("profissionais")}
        >
          👩‍⚕️ Profissionais
        </button>
      </nav>

      {tela === "agenda" && (
        <>



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
                {nomeDiaSemana(d.dia)} • {d.dia.split("-").reverse().join("/")}
              </strong>

              <span>✅ Livres: {d.livres}</span><br />
              <span>❌ Ocupados: {d.ocupados}</span>
            </li>
          ))}
        </ul>
      </div>


      <div className="card">
        <h2>Agenda do Dia</h2>

          <input
            type="date"
            value={filtroData}
            onChange={(e) => {
              setFiltroData(e.target.value);
              setData(e.target.value);
              setHora("");
              setProfissional(null);
            }}
          />

      </div>




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
                  a.data === data &&
                  a.profissional === p.nome
              ).length;

              const livres = HORARIOS.length - ocupados;

              return (
                <option
                  key={i}
                  value={p.nome}
                  disabled={livres === 0}
                >
                  {p.nome} ({p.tipo}) – {livres === 0 ? "Sem vagas" : `${livres} vagas`}
                </option>
              );
            })}
          </select>
        )}






        <button onClick={adicionar}>Salvar</button>
      </div>

      <div className="card">
        <h2>Horários do Dia</h2>

        {!profissional && <p>Selecione um profissional.</p>}


        {!filtroData && <p>Selecione um dia para ver os horários.</p>}

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
                  if (!h.ocupado) {
                    setHora(h.hora);
                  }
                }}
              >


                {h.hora} {h.ocupado ? "❌ Ocupado" : "✅ Livre"}
              </li>
            ))}
          </ul>
        )}
      </div>


      <div className="card">
        <h2>Agendamentos</h2>
        <ul>
          {agendamentosDoDia.map((a, i) => (
            <li key={i} className="item-agenda">
              <div>
                <span>{a.data} {a.hora}</span><br />
                <strong>{a.paciente}</strong><br />
                <small>{a.tipo} • {a.profissional}</small>
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
      )}

      {tela === "profissionais" && (
        <div className="card destaque">
          <h2>Cadastro de Profissionais</h2>

          <input
            placeholder="Nome do profissional"
            value={nomeProf}
            onChange={(e) => setNomeProf(e.target.value)}
          />

          <select
            value={tipoProf}
            onChange={(e) => setTipoProf(e.target.value)}
          >
            <option value="">Tipo de atendimento</option>
            <option value="Psicologia">Psicologia</option>
            <option value="Fonoaudiologia">Fonoaudiologia</option>
            <option value="Terapia Ocupacional">Terapia Ocupacional</option>
            <option value="Psicopedagogia">Psicopedagogia</option>
          </select>

          <p><strong>Dias de atendimento:</strong></p>

          <div className="dias-semana">
            {[1, 2, 3, 4, 5].map((d) => (
              <label key={d} className="checkbox-dia">
                <input
                  type="checkbox"
                  checked={diasProf.includes(d)}
                  onChange={() =>
                    setDiasProf(
                      diasProf.includes(d)
                        ? diasProf.filter(x => x !== d)
                        : [...diasProf, d]
                    )
                  }
                />
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex"][d]}
              </label>
            ))}
          </div>

          <button onClick={adicionarProfissional}>
            Salvar profissional
          </button>

          <hr />

          <h3>Profissionais cadastrados</h3>

          <ul>
            {profissionais.map((p, i) => (
              <li key={i}>
                <strong>{p.nome}</strong><br />
                <small>
                  {p.tipo} • {p.diasAtendimento.map(d => ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][d]).join(", ")}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tela === "planilha" && (
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
      )}



    </div>

    

  );
}

export default App;
