import { useEffect, useState } from "react";

export function useProfissionais() {
  const [profissionais, setProfissionais] = useState(() => {
    const salvo = localStorage.getItem("profissionais");
    return salvo ? JSON.parse(salvo) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "profissionais",
      JSON.stringify(profissionais)
    );
  }, [profissionais]);

  const adicionarProfissional = (novoProfissional) => {
    setProfissionais((prev) => [...prev, novoProfissional]);
  };

  return {
    profissionais,
    setProfissionais,
    adicionarProfissional
  };
}
