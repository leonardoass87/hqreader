import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Manga = {
  id: number;
  titulo: string;
  descricao: string;
  capa: string;
};

type Props = {
  mangas: Manga[];
};

const Carrossel = ({ mangas }: Props) => {
  const navigate = useNavigate();
  const ultimosMangas = mangas.slice(-5).reverse(); // últimos 5, do mais recente para o mais antigo
  const [index, setIndex] = useState(0);

  // Troca automática a cada 10 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ultimosMangas.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [ultimosMangas.length]);

  const manga = ultimosMangas[index];

  if (!manga) return null;

  return (
    <section className="bg-zinc-800 text-white py-6 px-4 md:px-12 overflow-hidden relative">
      <h2 className="text-xl font-semibold mb-6 text-center">Últimos Mangás Publicados</h2>

      <div className="relative overflow-hidden rounded-lg h-[400px]">
        {/* Fundo borrado */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-md brightness-50 scale-110"
          style={{ backgroundImage: `url(http://localhost:8000${manga.capa})` }}
        ></div>

        {/* Conteúdo principal */}
        <div className="relative z-10 flex flex-col md:flex-row h-full px-6 items-center justify-between">
          {/* Texto */}
          <div className="text-left max-w-lg text-white">
            <h3 className="text-3xl font-bold drop-shadow">{manga.titulo}</h3>
            <p className="mt-4 text-gray-300">{manga.descricao}</p>
            <button
              onClick={() => navigate(`/manga/${manga.id}`)}
              className="mt-6 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300"
            >
              Começar Leitura →
            </button>
          </div>

          {/* Imagem com recorte */}
          <div className="hidden md:block w-[240px] h-[340px] relative">
            <img
              src={`http://localhost:8000${manga.capa}`}
              alt={manga.titulo}
              className="w-full h-full object-cover rounded shadow-lg"
              style={{ clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
            />
          </div>
        </div>

        {/* Bolinhas de navegação */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {ultimosMangas.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === index ? "bg-white" : "bg-gray-500"
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carrossel;
