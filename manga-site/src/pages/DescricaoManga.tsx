import { useParams, useNavigate } from 'react-router-dom'
import mangas from '../data/mangas.json'

function DescricaoManga() {
  const { id } = useParams()
  const navigate = useNavigate()
  const manga = mangas.find(m => m.id === id)

  if (!manga) return <p className="text-white p-6">Mangá não encontrado.</p>

  const primeiroCap = manga.capitulos[0]
  const ultimoCap = manga.capitulos[manga.capitulos.length - 1]

  return (
    <div className="bg-black text-white min-h-screen p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={manga.capa}
          alt={manga.titulo}
          className="w-[210px] h-[300px] object-cover rounded"
        />

        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-bold">{manga.titulo}</h1>
          <h2 className="text-lg italic text-gray-400">{manga.subtitulo}</h2>

          <div className="flex flex-wrap gap-2">
            {manga.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-zinc-700 text-sm px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-gray-300 text-sm">{manga.descricao}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-400 pt-2">
            <div><strong>Status:</strong> {manga.status}</div>
            <div><strong>Tipo:</strong> {manga.tipo}</div>
            <div><strong>Autor:</strong> {manga.autor}</div>
            <div><strong>Lançado:</strong> {manga.lancado_em}</div>
            <div><strong>Atualizado:</strong> {manga.atualizado_em}</div>
            <div><strong>Views:</strong> {manga.visualizacoes.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-800 p-4 rounded">
        <h3 className="font-semibold text-lg mb-3">Capítulos</h3>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => navigate(`/leitor/${manga.id}/${primeiroCap.numero}`)}
            className="bg-red-700 px-4 py-2 rounded hover:bg-red-600"
          >
            Primeiro Capítulo
          </button>
          <button
            onClick={() => navigate(`/leitor/${manga.id}/${ultimoCap.numero}`)}
            className="bg-red-700 px-4 py-2 rounded hover:bg-red-600"
          >
            Capítulo Recente
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {manga.capitulos.map((cap) => (
            <button
              key={cap.numero}
              onClick={() => navigate(`/leitor/${manga.id}/${cap.numero}`)}
              className="bg-zinc-700 hover:bg-zinc-600 text-sm px-4 py-2 rounded text-left"
            >
              <strong>Capítulo {cap.numero}</strong>
              <div className="text-xs text-gray-400">{cap.data}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DescricaoManga
