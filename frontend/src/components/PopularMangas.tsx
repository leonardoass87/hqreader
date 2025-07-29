import { useEffect, useState } from "react";

type Manga = {
  id: number;
  titulo: string;
  capa: string;
};

export default function PopularMangas() {
  const [populares, setPopulares] = useState<Manga[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/mangas/populares")
      .then(res => res.json())
      .then(data => setPopulares(data))
      .catch(err => console.error("Erro ao buscar populares:", err));
  }, []);

  return (
    <section>
      <h2 className="text-lg font-bold mb-2">Populares</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {populares.map((manga) => (
          <div
            key={manga.id}
            className="bg-zinc-800 h-40 rounded flex items-center justify-center overflow-hidden"
          >
            <img
              src={`http://localhost:8000${manga.capa}`}
              alt={manga.titulo}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
