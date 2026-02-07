import { useEffect, useState } from "react";

export function useAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    const dados = localStorage.getItem("agendamentos");
    if (dados) setAgendamentos(JSON.parse(dados));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "agendamentos",
      JSON.stringify(agendamentos)
    );
  }, [agendamentos]);

  return { agendamentos, setAgendamentos };
}
