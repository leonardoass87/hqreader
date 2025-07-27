from pydantic import BaseModel
from typing import List, Optional

# -----------------------------------------------
# 📘 Schema de criação de mangá (entrada do POST)
# -----------------------------------------------
class MangaCreate(BaseModel):
    titulo: str               # Título do mangá
    descricao: str            # Descrição do mangá

# -------------------------------------------------
# 📘 Schema de criação de capítulo (entrada do POST)
# -------------------------------------------------
class CapituloCreate(BaseModel):
    numero: int               # Número do capítulo
    pasta: str                # Caminho relativo da pasta (ex: /static/manga_1_cap_2)
    manga_id: int             # ID do mangá ao qual pertence

# --------------------------------------------------
# 📘 Schema de resposta de capítulo (usado no GET)
# --------------------------------------------------
class Capitulo(BaseModel):
    id: int                   # ID único do capítulo
    numero: int               # Número do capítulo
    pasta: str                # Caminho relativo da pasta
    paginas: int              # Número de páginas (contadas automaticamente)

    class Config:
        from_attributes = True  # Substitui orm_mode (Pydantic v2+)

# --------------------------------------------------
# 📘 Schema completo do mangá (GET com capítulos)
# --------------------------------------------------
class Manga(BaseModel):
    id: int                   # ID do mangá
    titulo: str               # Título
    descricao: str            # Descrição
    capa: str                 # Caminho da imagem da capa (ex: /uploads/abc123.jpg)
    capitulos: Optional[List[Capitulo]] = []  # Lista de capítulos (opcional)

    class Config:
        from_attributes = True

# --------------------------------------------------
# 📘 Schema para login do Admin (POST /admin/login)
# --------------------------------------------------
class AdminLogin(BaseModel):
    username: str             # Nome de usuário
    password: str             # Senha
