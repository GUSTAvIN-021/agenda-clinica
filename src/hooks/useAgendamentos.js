import { useEffect, useState, useRef } from "react";

export function useAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const carregou = useRef(false);

  // carregar do localStorage
  useEffect(() => {
    const dados = localStorage.getItem("agendamentos");
    if (dados) {
      setAgendamentos(JSON.parse(dados));
    }
    carregou.current = true;
  }, []);

  // salvar no localStorage (somente depois de carregar)
  useEffect(() => {
    if (!carregou.current) return;

    localStorage.setItem(
      "agendamentos",
      JSON.stringify(agendamentos)
    );
  }, [agendamentos]);

  return { agendamentos, setAgendamentos };
}
