import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Tipo do mangá com capítulos (expandível no futuro)
type Manga = {
  id: number;
  titulo: string;
  descricao: string;
  capa: string;
  // capítulos poderiam ser adicionados aqui no futuro: capitulos: Capitulo[]
};

function DescricaoManga() {
  const { id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();

  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca os dados do mangá assim que a tela carrega
  useEffect(() => {
    fetch(`http://localhost:8000/api/mangas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setManga(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar o mangá:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center text-white">Carregando...</p>;
  if (!manga) return <p className="text-center text-white">Mangá não encontrado.</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-green-400 hover:underline mb-4"
      >
        ← Voltar
      </button>

      {/* Dados do mangá */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <img
          src={`http://localhost:8000${manga.capa}`}
          alt={manga.titulo}
          className="w-[210px] h-[300px] object-cover rounded"
        />
        <div>
          <h1 className="text-2xl font-bold mb-2">{manga.titulo}</h1>
          <p className="text-gray-300 mb-4">{manga.descricao}</p>

          {/* Aqui no futuro: Autor, status, gênero etc. */}
        </div>
      </div>

      {/* Simulação de capítulos */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Capítulos</h2>
        <div className="space-y-2">
          {[1, 2, 3].map((capitulo) => (
            <button
              key={capitulo}
              onClick={() => navigate(`/leitor/${manga.id}/${capitulo}`)}
              className="w-full text-left px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded"
            >
              Capítulo {capitulo}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DescricaoManga;
