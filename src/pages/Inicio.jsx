function Inicio({ setTela }) {
  return (
    <div className="inicio-container">
      <div className="inicio-card">
        <img
          src="/logo-unique.png"
          alt="Clínica Unique"
          className="inicio-logo"
        />

        <h1>Unique</h1>
        <p>Atendimento multidisciplinar</p>

        <button
          className="btn-entrar"
          onClick={() => setTela("agenda")}
        >
          Entrar no sistema
        </button>
      </div>
    </div>
  );
}

export default Inicio;
