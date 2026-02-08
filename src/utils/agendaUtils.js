export const HORARIOS = [
  "08:00","09:00","10:00","11:00",
  "13:00","14:00","15:00","16:00","17:00"
];

// 🔥 AGORA retorna "Seg", "Ter", etc
export const getDiaSemana = (data) => {
  const dias = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const d = new Date(data + "T00:00:00");
  return dias[d.getDay()];
};

export const nomeDiaSemana = (data) => {
  return getDiaSemana(data);
};

export const gerarProximosDias = (qtd = 7) => {
  const dias = [];
  const hoje = new Date();

  for (let i = 0; i < qtd; i++) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() + i);
    dias.push(d.toISOString().split("T")[0]);
  }

  return dias;
};
