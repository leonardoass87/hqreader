import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import mangas from "./data/mangas.json";

function Leitor() {
  // Obtém os parâmetros da URL: id do mangá e número do capítulo
  const { id, capituloId } = useParams();
  const navigate = useNavigate();

  // Estado para controle da barra de progresso
  const [scrollProgress, setScrollProgress] = useState(0);

  // Localiza o mangá com base no id da URL
  const manga = mangas.find((m) => m.id === id);

  // Localiza o capítulo atual convertendo o capituloId para número
  const capituloAtual = manga?.capitulos.find(
    (c) => c.numero === Number(capituloId)
  );

  // Se não encontrar mangá ou capítulo, exibe erro amigável
  if (!manga || !capituloAtual) {
    return (
      <div className="text-center p-10 text-red-500">
        Mangá ou capítulo não encontrado.
      </div>
    );
  }

  // Índice do capítulo atual no array
  const indiceAtual = manga.capitulos.findIndex(
    (c) => c.numero === Number(capituloId)
  );
  const capAnterior = manga.capitulos[indiceAtual - 1];
  const capProximo = manga.capitulos[indiceAtual + 1];

  // Quando a rota muda, rola suavemente para o topo
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [capituloId]);

  // Controla a barra de progresso com base no scroll da página
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

  // Função para trocar de capítulo e rolar para o topo após pequena pausa
  const irParaCapitulo = (numero: number) => {
    navigate(`/leitor/${manga.id}/${numero}`);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  return (
    <div className="bg-black text-white min-h-screen p-4 relative">
      {/* Barra de progresso no topo */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div
          className="bg-red-500 h-1 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
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

      {/* Conteúdo do capítulo - imagens com numeração */}
      <div className="flex flex-col items-center gap-4 mt-4">
        {[...Array(capituloAtual.paginas)].map((_, index) => (
          <div key={index} className="w-full max-w-2xl relative">
            <img
              src={`${capituloAtual.pasta}/${index + 1}.jpg`}
              alt={`Página ${index + 1}`}
              className="w-full rounded shadow-lg mb-2"
            />
            {/* Número da página sobreposto na imagem */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 px-2 py-1 text-xs text-white rounded">
              Página {index + 1} de {capituloAtual.paginas}
            </div>
          </div>
        ))}
      </div>

      {/* Botões flutuantes laterais ← → */}
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

      {/* Botão flutuante "Voltar ao Topo" */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-zinc-800 hover:bg-zinc-600 text-white px-3 py-2 rounded-full shadow-lg z-50"
      >
        ↑ Topo
      </button>

      {/* Botão "Próximo Capítulo" no fim da leitura */}
      <div className="text-center mt-10">
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

      {/* Botões convencionais no fim da leitura */}
      <div className="flex justify-between max-w-2xl mx-auto mt-8 px-4">
        {capAnterior ? (
          <button
            onClick={() => irParaCapitulo(capAnterior.numero)}
            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded"
          >
            ← Capítulo {capAnterior.numero}
          </button>
        ) : (
          <div />
        )}

        {capProximo ? (
          <button
            onClick={() => irParaCapitulo(capProximo.numero)}
            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded"
          >
            Capítulo {capProximo.numero} →
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export default Leitor;
