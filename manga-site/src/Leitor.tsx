import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type Capitulo = {
  id: number;
  numero: number;
  pasta: string;
  manga_id: number;
  paginas: number; // 👈 isso resolve o erro!
};

type Manga = {
  id: number;
  titulo: string;
  descricao: string;
  capa: string;
};

function Leitor() {
  const { id, capituloId } = useParams();
  const navigate = useNavigate();

  const [manga, setManga] = useState<Manga | null>(null);
  const [capitulos, setCapitulos] = useState<Capitulo[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // Carrega dados do mangá
  useEffect(() => {
    fetch(`http://localhost:8000/api/mangas/${id}`)
      .then((res) => res.json())
      .then((data) => setManga(data))
      .catch((err) => console.error("Erro ao carregar mangá:", err));
  }, [id]);

  // Carrega capítulos
  useEffect(() => {
    fetch(`http://localhost:8000/api/mangas/${id}/capitulos`)
      .then((res) => res.json())
      .then((data) => {
        setCapitulos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar capítulos:", err);
        setLoading(false);
      });
  }, [id]);

  // Rola para o topo ao trocar de capítulo
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [capituloId]);

  // Atualiza barra de progresso de leitura
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const capituloAtual = capitulos.find((c) => c.numero === Number(capituloId));
  const indiceAtual = capitulos.findIndex(
    (c) => c.numero === Number(capituloId)
  );
  const capAnterior = capitulos[indiceAtual - 1];
  const capProximo = capitulos[indiceAtual + 1];

  const irParaCapitulo = (numero: number) => {
    navigate(`/leitor/${id}/${numero}`);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  if (loading) return <div className="text-white p-10">Carregando...</div>;
  if (!manga || !capituloAtual)
    return (
      <div className="text-center p-10 text-red-500">
        Mangá ou capítulo não encontrado.
      </div>
    );

  // 🛠️ Logs úteis para debug (ativar se quiser)
  // console.log("🔎 capituloAtual:", capituloAtual);
  // console.log("📄 Total de páginas:", capituloAtual.paginas);

  return (
    <div className="bg-black text-white min-h-screen p-4 relative">
      {/* Barra de progresso no topo */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div
          className="bg-red-500 h-1 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Botão para voltar à Home */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => navigate("/")}
          className="bg-zinc-800 hover:bg-zinc-600 text-white px-4 py-2 rounded shadow-md"
        >
          ← Voltar para Home
        </button>
      </div>

      {/* Cabeçalho fixo com título e capítulo */}
      <header className="sticky top-0 bg-black z-40 text-center py-3 shadow-md">
        <h1 className="text-xl font-bold">
          {manga.titulo} - Capítulo {capituloAtual.numero}
        </h1>
      </header>

      {/* Botão "Próximo Capítulo" no topo */}
      <div className="text-center mt-4">
        <button
          disabled={!capProximo}
          onClick={() => capProximo && irParaCapitulo(capProximo.numero)}
          className={`px-6 py-2 rounded font-semibold transition-colors duration-200 ${
            capProximo
              ? "bg-red-600 hover:bg-red-500 text-white"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Próximo Capítulo →
        </button>
      </div>

      {/* Conteúdo do capítulo - imagens */}
      <div className="flex flex-col items-center gap-4 mt-4">
        {[...Array(capituloAtual.paginas || 0)].map((_, index) => {
          const imagemUrl = `http://localhost:8000${
            capituloAtual.pasta
          }/${String(index + 1).padStart(3, "0")}.webp`;
          return (
            <div key={index} className="w-full max-w-2xl">
              <img
                src={imagemUrl}
                alt={`Página ${index + 1}`}
                className="w-full rounded shadow-lg mb-6"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Navegação lateral */}
      {capAnterior && (
        <button
          onClick={() => irParaCapitulo(capAnterior.numero)}
          className="fixed top-1/2 left-3 transform -translate-y-1/2 bg-zinc-800 hover:bg-zinc-600 text-white p-3 rounded-full shadow z-50"
        >
          ←
        </button>
      )}
      {capProximo && (
        <button
          onClick={() => irParaCapitulo(capProximo.numero)}
          className="fixed top-1/2 right-3 transform -translate-y-1/2 bg-zinc-800 hover:bg-zinc-600 text-white p-3 rounded-full shadow z-50"
        >
          →
        </button>
      )}

      {/* Botão "Voltar ao Topo" */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-zinc-800 hover:bg-zinc-600 text-white px-3 py-2 rounded-full shadow-lg z-50"
      >
        ↑ Topo
      </button>

      {/* Navegação inferior */}
      <div className="flex justify-between max-w-2xl mx-auto mt-8 px-4">
        {capAnterior ? (
          <button
            onClick={() => irParaCapitulo(capAnterior.numero)}
            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded"
          >
            ← Capítulo {capAnterior.numero}
          </button>
        ) : (
          <span className="w-[120px]" /> // ⬅ evita desalinhamento
        )}

        {capProximo ? (
          <button
            onClick={() => irParaCapitulo(capProximo.numero)}
            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded"
          >
            Capítulo {capProximo.numero} →
          </button>
        ) : (
          <span className="w-[120px]" />
        )}
      </div>
    </div>
  );
}

export default Leitor;
