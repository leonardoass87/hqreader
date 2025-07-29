import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Carrossel from "./components/Carrossel";
import Sidebar from "./components/Sidebar";
import PopularMangas from "./components/PopularMangas";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
      <Header/>

      {/* CONTAINER CENTRALIZADO */}
      <div className="max-w-7xl mx-auto px-4">
        {/* CARROSSEL */}
        <Carrossel mangas={mangas} />

        {/* CORPO PRINCIPAL */}
        <main className="flex flex-col md:flex-row gap-6 py-6">
          {/* COLUNA ESQUERDA */}
          <div className="flex-1 space-y-8">
            <PopularMangas />

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
          <Sidebar />
        </main>
      </div>

      {/* RODAPÉ */}
    <Footer/>
    </div>
  );
}

export default App;
