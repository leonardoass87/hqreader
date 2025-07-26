from pydantic import BaseModel
from typing import List, Optional

# Schema de criação de mangá
class MangaCreate(BaseModel):
    titulo: str
    descricao: str

# Schema de resposta de capítulo
class Capitulo(BaseModel):
    id: int
    numero: int
    pasta: str
    paginas: int  # 👈 isso aqui é essencial!

    class Config:
        orm_mode = True

# Schema completo de mangá com capítulos (opcional para uso)
class Manga(BaseModel):
    id: int
    titulo: str
    descricao: str
    capa: str
    capitulos: Optional[List[Capitulo]] = []  # Relacionamento

    class Config:
        orm_mode = True

# Schema de criação de capítulo
class CapituloCreate(BaseModel):
    numero: int
    pasta: str
    manga_id: int
