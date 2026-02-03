import { useState, useEffect } from "react";
import "./App.css";
import PlanilhaPage from "./pages/PlanilhaPage";
import AgendaPage from "./pages/AgendaPage";
import PacientePage from "./pages/PacientePage";

function App() {
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
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
        <AgendaPage
          setTela={setTela}
          setPacienteSelecionado={setPacienteSelecionado}
          agendamentos={agendamentos}
          setAgendamentos={setAgendamentos}
          paciente={paciente}
          setPaciente={setPaciente}
          data={data}
          setData={setData}
          hora={hora}
          setHora={setHora}
          filtroData={filtroData}
          setFiltroData={setFiltroData}
          profissional={profissional}
          setProfissional={setProfissional}
          profissionais={profissionais}
          profissionaisDisponiveis={profissionaisDisponiveis}
          HORARIOS={HORARIOS}
          horariosDoDia={horariosDoDia}
          agendamentosDoDia={agendamentosDoDia}
          excluirHorario={excluirHorario}
          resumoDias={resumoDias}
          nomeDiaSemana={nomeDiaSemana}
          totalAgendamentos={totalAgendamentos}
          taxaOcupacao={taxaOcupacao}
          atendimentosPorTipo={atendimentosPorTipo}
          historicoPaciente={historicoPaciente}
          adicionar={adicionar}
        />
      )}

      {tela === "paciente" && (
        <PacientePage
          pacienteSelecionado={pacienteSelecionado}
          agendamentos={agendamentos}
          setTela={setTela}
        />
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
        <PlanilhaPage
          diaPlanilha={diaPlanilha}
          setDiaPlanilha={setDiaPlanilha}
          profissionais={profissionais}
          HORARIOS={HORARIOS}
          getAgendamento={getAgendamento}
        />
      )}



    </div>

    

  );
}

export default App;
