import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Carrossel from "./components/Carrossel";

// Define o tipo dos dados que a API vai retornar
type Manga = {
  id: number;
  titulo: string;
  descricao: string;
  capa: string;
};

function App() {
  const navigate = useNavigate();

  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/mangas")
      .then((res) => res.json())
      .then((data) => {
        setMangas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar mangás:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* HEADER */}
      <header className="bg-zinc-900 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-400">MReader</h1>
        <nav className="space-x-6">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Mangás</a>
        </nav>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Buscar mangá..."
            className="bg-zinc-800 text-white px-4 py-1 rounded outline-none"
          />
          {localStorage.getItem("adminName") && (
            <span className="text-sm text-green-400 font-semibold">
              {localStorage.getItem("adminName")}
            </span>
          )}
          <button
            onClick={() => {
              const token = localStorage.getItem("adminToken");
              navigate(token ? "/admin/dashboard" : "/admin/login");
            }}
            className="text-white hover:text-green-400 transition"
            title="Área Admin"
          >
            👤
          </button>
        </div>
      </header>

      {/* CONTAINER CENTRALIZADO */}
      <div className="max-w-7xl mx-auto px-4">
        {/* CARROSSEL */}
        <Carrossel mangas={mangas} />

        {/* CORPO PRINCIPAL */}
        <main className="flex flex-col md:flex-row gap-6 py-6">
          {/* COLUNA ESQUERDA */}
          <div className="flex-1 space-y-8">
            {/* POPULARES (simulação fixa) */}
            <section>
              <h2 className="text-lg font-bold mb-2">Populares</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-zinc-800 h-40 rounded flex items-center justify-center"
                  >
                    <span>Mangá Popular {i + 1}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* TODOS OS MANGÁS */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">Todos os Mangás</h2>
                <div className="space-x-2 text-sm">
                  <button className="bg-zinc-700 px-2 py-1 rounded hover:bg-zinc-600">
                    Mais novos
                  </button>
                  <button className="bg-zinc-700 px-2 py-1 rounded hover:bg-zinc-600">
                    Melhores
                  </button>
                </div>
              </div>
              {loading ? (
                <p className="text-gray-400">Carregando mangás...</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mangas.map((manga) => (
                    <div
                      key={manga.id}
                      className="bg-zinc-800 rounded cursor-pointer hover:bg-zinc-700 p-4 flex flex-col items-center text-center"
                      onClick={() => navigate(`/manga/${manga.id}`)}
                    >
                      <img
                        src={`http://localhost:8000${manga.capa}`}
                        alt={manga.titulo}
                        className="w-[210px] h-[300px] object-cover rounded mb-2 mx-auto"
                      />
                      <h2 className="text-md font-semibold">{manga.titulo}</h2>
                      <p className="text-sm text-gray-400">{manga.descricao}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* COLUNA LATERAL DIREITA */}
          <aside className="w-full md:w-64 space-y-6">
            <section>
              <h2 className="text-md font-semibold mb-2">Top 10 da Semana</h2>
              <ul className="space-y-1 text-sm">
                {[...Array(5)].map((_, i) => (
                  <li key={i} className="bg-zinc-800 px-3 py-2 rounded">
                    📈 Mangá {i + 1}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-md font-semibold mb-2">Top 10 do Mês</h2>
              <ul className="space-y-1 text-sm">
                {[...Array(5)].map((_, i) => (
                  <li key={i} className="bg-zinc-800 px-3 py-2 rounded">
                    🏆 Mangá {i + 1}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </main>
      </div>

      {/* RODAPÉ */}
      <footer className="bg-zinc-900 text-center py-4 mt-10">
        <p className="text-gray-400">
          © 2025 MReader. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

export default App;
