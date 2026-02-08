import { useState } from "react";
import "./App.css";

// components
import Profissionais from "./components/Profissionais";
import Inicio from "./pages/Inicio";


// pages
import PlanilhaPage from "./pages/PlanilhaPage";
import AgendaPage from "./pages/AgendaPage";
import PacientePage from "./pages/PacientePage";
import DashboardPage from "./pages/DashboardPage";

// hooks
import { useAgendamentos } from "./hooks/useAgendamentos";
import { useProfissionais } from "./hooks/useProfissionais";
import { useDashboard } from "./hooks/useDashboard";
import { useAgenda } from "./hooks/useAgenda";

// utils
import {
  HORARIOS,
  nomeDiaSemana
} from "./utils/agendaUtils";
import { getNomeDiaSemana } from "./utils/agendaUtils";

function App() {
  // ======================
  // STATES
  // ======================
  const [tela, setTela] = useState("inicio");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [paciente, setPaciente] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [profissional, setProfissional] = useState(null);

  const [nomeProf, setNomeProf] = useState("");
  const [tipoProf, setTipoProf] = useState("");
  const [diasProf, setDiasProf] = useState([]);
  const [diaPlanilha, setDiaPlanilha] = useState("");

  // ======================
  // HOOKS
  // ======================
  const { agendamentos, setAgendamentos } = useAgendamentos();
  const {
  profissionais,
  adicionarProfissional,
  excluirProfissional
} = useProfissionais();


  const {
    totalAgendamentos,
    taxaOcupacao,
    atendimentosPorTipo
  } = useDashboard(agendamentos, HORARIOS);

  const {
    adicionar,
    excluirHorario,
    agendamentosDoDia,
    horariosDoDia,
    resumoDias
  } = useAgenda({
    agendamentos,
    setAgendamentos,
    profissionais,
    profissional,
    paciente,   // ✅ agora passa
    data,
    filtroData,
    hora,       // ✅ agora passa
    HORARIOS
  });


  // ======================
  // FUNÇÕES
  // ======================
  const salvarProfissional = () => {
    if (!nomeProf || !tipoProf || diasProf.length === 0) {
      alert("Preencha todos os campos do profissional.");
      return;
    }

    adicionarProfissional({
      nome: nomeProf,
      tipo: tipoProf,
      diasAtendimento: diasProf
    });

    setNomeProf("");
    setTipoProf("");
    setDiasProf([]);
  };

  const profissionaisDisponiveis = data
    ? profissionais.filter(p =>
        p.diasAtendimento.includes(getNomeDiaSemana(data))
      )
    : [];


  const getAgendamento = (dia, hora, profissional) => {
    return agendamentos.find(
      a =>
        a.data === dia &&
        a.hora === hora &&
        a.profissional === profissional.nome
    );
  };

  const historicoPaciente = paciente
    ? agendamentos.filter(a => a.paciente === paciente)
    : [];

  // ======================
  // JSX
  // ======================
  return (
  <div className="container">

    {tela === "inicio" && <Inicio setTela={setTela} />}

{tela !== "inicio" && (

    <div className="menu">
      <button
        className={tela === "agenda" ? "ativo" : ""}
        onClick={() => setTela("agenda")}
      >
        Agenda
      </button>

      <button
        className={tela === "profissionais" ? "ativo" : ""}
        onClick={() => setTela("profissionais")}
      >
        Profissionais
      </button>

      <button
        className={tela === "pacientes" ? "ativo" : ""}
        onClick={() => setTela("pacientes")}
      >
        Pacientes
      </button>

      <button
        className={tela === "dashboard" ? "ativo" : ""}
        onClick={() => setTela("dashboard")}
      >
        Dashboard
      </button>

      <button
        className={tela === "planilha" ? "ativo" : ""}
        onClick={() => setTela("planilha")}
      >
        Planilha
      </button>
    </div>

)}



    {tela === "agenda" && (
      <AgendaPage
        agendamentos={agendamentos}
        resumoDias={resumoDias}
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
        nomeDiaSemana={nomeDiaSemana}
        totalAgendamentos={totalAgendamentos}
        taxaOcupacao={taxaOcupacao}
        atendimentosPorTipo={atendimentosPorTipo}
        historicoPaciente={historicoPaciente}
        adicionar={adicionar}
        setTela={setTela}
        setPacienteSelecionado={setPacienteSelecionado}
      />
    )}

    {tela === "profissionais" && (
      <Profissionais
        profissionais={profissionais}
        nomeProf={nomeProf}
        setNomeProf={setNomeProf}
        tipoProf={tipoProf}
        setTipoProf={setTipoProf}
        diasProf={diasProf}
        setDiasProf={setDiasProf}
        salvarProfissional={salvarProfissional}
        excluirProfissional={excluirProfissional}
        setTela={setTela}
      />

    )}





    {tela === "pacientes" && (
      <PacientePage
        pacienteSelecionado={pacienteSelecionado}
        setPacienteSelecionado={setPacienteSelecionado}
        agendamentos={agendamentos}
        setTela={setTela}
      />


    )}


    {tela === "dashboard" && (
      <DashboardPage
        totalAgendamentos={totalAgendamentos}
        taxaOcupacao={taxaOcupacao}
        atendimentosPorTipo={atendimentosPorTipo}
      />
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
