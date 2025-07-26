import mangas from "./data/mangas.json";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate(); // ✅ agora está sendo usada

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* HEADER */}
      <header className="bg-zinc-900 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-400">MReader</h1>
        <nav className="space-x-6">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            Mangás
          </a>
        </nav>
        <input
          type="text"
          placeholder="Buscar mangá..."
          className="bg-zinc-800 text-white px-4 py-1 rounded outline-none"
        />
      </header>

      {/* CARROSSEL */}
      <section className="bg-zinc-800 p-6 text-center">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Último Mangá Publicado
        </h2>
        <div className="h-64 bg-zinc-700 flex items-center justify-center rounded">
          <p className="text-gray-300">
            [Capa e descrição do mangá em destaque]
          </p>
        </div>
      </section>

      {/* CORPO PRINCIPAL */}
      <main className="flex flex-col md:flex-row gap-6 p-6">
        {/* COLUNA ESQUERDA */}
        <div className="flex-1 space-y-8">
          {/* POPULARES */}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mangas.map((manga) => (
                <div
                  key={manga.id}
                  className="bg-zinc-800 rounded cursor-pointer hover:bg-zinc-700 p-4 flex flex-col items-center text-center"
                  onClick={() => navigate(`/manga/${manga.id}`)}
                >
                  <img
                    src={manga.capa}
                    alt={manga.titulo}
                  className="w-[210px] h-[300px] object-cover rounded mb-2 mx-auto"
                  />
                  <h2 className="text-md font-semibold">{manga.titulo}</h2>
                  <p className="text-sm text-gray-400">{manga.descricao}</p>
                </div>
              ))}
            </div>
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
