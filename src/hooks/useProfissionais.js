import { useEffect, useState } from "react";

export function useProfissionais() {
  const [profissionais, setProfissionais] = useState([]);

  useEffect(() => {
    const dados = localStorage.getItem("profissionais");
    if (dados) setProfissionais(JSON.parse(dados));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "profissionais",
      JSON.stringify(profissionais)
    );
  }, [profissionais]);

  const adicionarProfissional = (profissional) => {
    setProfissionais(prev => [...prev, profissional]);
  };

  const excluirProfissional = (index) => {
    if (!window.confirm("Deseja realmente excluir este profissional?")) return;
    setProfissionais(prev => prev.filter((_, i) => i !== index));
  };

  return {
    profissionais,
    adicionarProfissional,
    excluirProfissional
  };
}
