import "./Home.css";

const categorias = [
  "Hombre",
  "Mujer",
  "Calzado",
  "Accesorios",
];

const Home = () => {
  return (
    <main className="home">

      <section className="hero">

        <div className="hero-content">

          <h1>La moda también puede tener una segunda oportunidad.</h1>

          <p>
            Comprá y vendé ropa usada de manera fácil, segura y sostenible.
          </p>

          <button>Explorar productos</button>

        </div>

      </section>

      <section className="categories">

        <h2>Categorías</h2>

        <div className="category-grid">

          {categorias.map((categoria) => (
            <div key={categoria} className="category-card">
              {categoria}
            </div>
          ))}

        </div>

      </section>

      <section className="about">

        <h2>¿Por qué elegir Repilche?</h2>

        <div className="about-grid">

          <div className="about-card">
            <h3>Moda sostenible</h3>
            <p>Ayudás al planeta reutilizando prendas.</p>
          </div>

          <div className="about-card">
            <h3>Ahorrá dinero</h3>
            <p>Encontrá ropa en excelente estado a mejores precios.</p>
          </div>

          <div className="about-card">
            <h3>Comunidad</h3>
            <p>Comprá y vendé de forma simple entre personas.</p>
          </div>

        </div>

      </section>

    </main>
  );
};

export default Home;