import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Define o tipo dos dados de um mangá
type Manga = {
  id: number;
  titulo: string;
  descricao: string;
  capa: string;
};

function AdminDashboard() {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [capa, setCapa] = useState<File | null>(null);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [uploadCapituloAberto, setUploadCapituloAberto] = useState<number | null>(null);
  const [capituloNumero, setCapituloNumero] = useState("");
  const [capituloImagens, setCapituloImagens] = useState<FileList | null>(null);

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [tituloEditado, setTituloEditado] = useState("");
  const [descricaoEditada, setDescricaoEditada] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/mangas")
      .then((res) => res.json())
      .then(setMangas)
      .catch((err) => {
        console.error("Erro ao carregar mangás:", err);
        setErro("Erro ao carregar mangás.");
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!capa) {
      setErro("Selecione uma imagem de capa.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("capa", capa);

    try {
      const res = await fetch("http://localhost:8000/api/mangas", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Erro ao cadastrar mangá");
      }

      const novo = await res.json();
      setMangas((prev) => [...prev, novo]);
      setTitulo("");
      setDescricao("");
      setCapa(null);
      setMensagem("Mangá cadastrado com sucesso!");
    } catch (err: any) {
      console.error("Erro:", err);
      setErro(err.message || "Erro inesperado");
    }
  };

  const deletarManga = async (id: number) => {
    const confirmar = confirm("Tem certeza que deseja excluir este mangá?");
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:8000/api/mangas/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao excluir mangá");

      setMangas((prev) => prev.filter((m) => m.id !== id));
      console.log("Mangá excluído com sucesso");
    } catch (err) {
      console.error("Erro ao excluir mangá:", err);
    }
  };

  const salvarEdicao = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/mangas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: tituloEditado, descricao: descricaoEditada }),
      });

      if (!res.ok) throw new Error("Erro ao editar mangá");

      const atualizado = await res.json();
      setMangas((prev) => prev.map((m) => (m.id === id ? atualizado : m)));
      setEditandoId(null);
      console.log("Mangá atualizado com sucesso");
    } catch (err) {
      console.error("Erro ao atualizar mangá:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mb-4">
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white text-sm"
        >
          ← Voltar para Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">Painel do Administrador</h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-zinc-900 p-4 rounded space-y-4">
        <h2 className="text-xl font-semibold mb-2">Adicionar Novo Mangá</h2>

        {erro && <p className="text-red-400 text-sm">{erro}</p>}
        {mensagem && <p className="text-green-400 text-sm">{mensagem}</p>}

        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 text-white"
          required
        />

        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 text-white"
          required
        />

        <label className="block text-sm font-medium text-gray-300">Selecionar Capa</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCapa(e.target.files?.[0] || null)}
          className="w-full p-2 bg-zinc-800 text-white"
          required
        />

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
        >
          Cadastrar Mangá
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Mangás Cadastrados</h2>

      <div className="bg-zinc-900 rounded overflow-hidden shadow">
        <table className="w-full table-auto text-sm">
          <thead className="bg-zinc-800 text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Capa</th>
              <th className="px-4 py-2 text-left">Título</th>
              <th className="px-4 py-2 text-left">Descrição</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {mangas.map((manga) => (
              <tr key={manga.id} className="border-t border-zinc-800 hover:bg-zinc-800">
                <td className="px-4 py-2">
                  <img
                    src={`http://localhost:8000${manga.capa}`}
                    alt={manga.titulo}
                    className="w-20 h-28 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2 font-bold">
                  {editandoId === manga.id ? (
                    <input
                      value={tituloEditado}
                      onChange={(e) => setTituloEditado(e.target.value)}
                      className="bg-zinc-700 text-white p-1 rounded"
                    />
                  ) : (
                    manga.titulo
                  )}
                </td>
                <td className="px-4 py-2 text-gray-400">
                  {editandoId === manga.id ? (
                    <textarea
                      value={descricaoEditada}
                      onChange={(e) => setDescricaoEditada(e.target.value)}
                      className="bg-zinc-700 text-white p-1 rounded"
                    />
                  ) : (
                    manga.descricao
                  )}
                </td>
                <td className="px-4 py-2 space-y-2">
                  {editandoId === manga.id ? (
                    <>
                      <button
                        onClick={() => salvarEdicao(manga.id)}
                        className="bg-green-600 hover:bg-green-500 px-2 py-1 rounded text-white text-xs"
                      >
                        💾 Salvar
                      </button>
                      <button
                        onClick={() => setEditandoId(null)}
                        className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white text-xs"
                      >
                        ❌ Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditandoId(manga.id);
                          setTituloEditado(manga.titulo);
                          setDescricaoEditada(manga.descricao);
                        }}
                        className="bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-white text-xs"
                      >
                        ✏️ Editar
                      </button>

                      <button
                        onClick={() => deletarManga(manga.id)}
                        className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-white text-xs"
                      >
                        ❌ Excluir
                      </button>

                      <button
                        className="bg-green-600 hover:bg-green-500 px-2 py-1 rounded text-white text-xs"
                        onClick={() =>
                          setUploadCapituloAberto((prev) =>
                            prev === manga.id ? null : manga.id
                          )
                        }
                      >
                        📥 Capítulo
                      </button>
                    </>
                  )}

                  {uploadCapituloAberto === manga.id && (
                    <form
                      className="mt-2 space-y-2 bg-zinc-800 p-2 rounded"
                      onSubmit={async (e) => {
                        e.preventDefault();

                        if (!capituloNumero || !capituloImagens || capituloImagens.length === 0) {
                          console.warn("Número do capítulo ou imagens não fornecidos.");
                          return;
                        }

                        const formData = new FormData();
                        formData.append("numero", capituloNumero);
                        for (let i = 0; i < capituloImagens.length; i++) {
                          formData.append("imagens", capituloImagens[i]);
                        }

                        try {
                          const res = await fetch(
                            `http://localhost:8000/api/mangas/${manga.id}/capitulos/upload`,
                            {
                              method: "POST",
                              body: formData,
                            }
                          );

                          if (!res.ok) {
                            const msg = await res.text();
                            throw new Error(msg);
                          }

                          console.log("Capítulo enviado com sucesso!");
                          setCapituloNumero("");
                          setCapituloImagens(null);
                          setUploadCapituloAberto(null);
                        } catch (err) {
                          console.error("Erro ao enviar capítulo:", err);
                        }
                      }}
                    >
                      <input
                        type="number"
                        placeholder="Número do capítulo"
                        value={capituloNumero}
                        onChange={(e) => setCapituloNumero(e.target.value)}
                        className="w-full p-1 rounded bg-zinc-700 text-white text-sm"
                        required
                      />

                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setCapituloImagens(e.target.files)}
                        className="w-full p-1 bg-zinc-700 text-white text-sm"
                        required
                      />

                      <button
                        type="submit"
                        className="w-full bg-green-700 hover:bg-green-600 text-white py-1 rounded text-sm"
                      >
                        Enviar Capítulo
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
