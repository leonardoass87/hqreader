import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Tipo dos dados retornados pela API
type Manga = {
  id: number;
  titulo: string;
  capa: string;
  descricao: string;
};

const Sidebar = () => {
  const [topSemana, setTopSemana] = useState<Manga[]>([]);
  const [topMes, setTopMes] = useState<Manga[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/mangas/top?limit=5")
      .then((res) => res.json())
      .then((data) => {
        setTopSemana(data); // Usamos o mesmo resultado para ambos por enquanto
        setTopMes(data);
      })
      .catch((err) => console.error("Erro ao buscar top mangás:", err));
  }, []);

  return (
    <aside className="w-full md:w-64 space-y-6">
      {/* Top da Semana */}
      <section>
        <h2 className="text-md font-semibold mb-2">Top 10 da Semana</h2>
        <ul className="space-y-1 text-sm">
          {topSemana.map((manga, i) => (
            <li
              key={manga.id}
              className="bg-zinc-800 px-3 py-2 rounded cursor-pointer hover:bg-zinc-700 transition"
              onClick={() => navigate(`/manga/${manga.id}`)}
              title={manga.descricao}
            >
              📈 {i + 1}. {manga.titulo}
            </li>
          ))}
        </ul>
      </section>

      {/* Top do Mês */}
      <section>
        <h2 className="text-md font-semibold mb-2">Top 10 do Mês</h2>
        <ul className="space-y-1 text-sm">
          {topMes.map((manga, i) => (
            <li
              key={manga.id}
              className="bg-zinc-800 px-3 py-2 rounded cursor-pointer hover:bg-zinc-700 transition"
              onClick={() => navigate(`/manga/${manga.id}`)}
              title={manga.descricao}
            >
              🏆 {i + 1}. {manga.titulo}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
};

export default Sidebar;
