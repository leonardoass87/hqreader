import os
from sqlalchemy.orm import Session
import models, schemas
from settings import UPLOADS_BASE_PATH  # Ex: UPLOADS_BASE_PATH = "C:/Temp/Uploads/Mangas"

# --------------------------------------------------
# 🔍 Retorna todos os mangás com seus capítulos
# --------------------------------------------------
def get_mangas(db: Session):
    return db.query(models.Manga).all()

# --------------------------------------------------
# 🔍 Retorna um único mangá por ID
# --------------------------------------------------
def get_manga_by_id(db: Session, manga_id: int):
    return db.query(models.Manga).filter(models.Manga.id == manga_id).first()

# --------------------------------------------------
# 🆕 Cria um novo mangá no banco
# --------------------------------------------------
def create_manga(db: Session, manga: schemas.MangaCreate, capa_filename: str):
    db_manga = models.Manga(**manga.dict(), capa=capa_filename)
    db.add(db_manga)
    db.commit()
    db.refresh(db_manga)
    return db_manga

# --------------------------------------------------
# 🆕 Cria um capítulo, contando automaticamente as páginas
# --------------------------------------------------
def create_capitulo(db: Session, capitulo: schemas.CapituloCreate):
    # 🔁 Transforma o caminho relativo em absoluto
    caminho_pasta = capitulo.pasta
    if caminho_pasta.startswith("/static/"):
        caminho_pasta = caminho_pasta.replace("/static/", "")
    
    pasta_absoluta = os.path.join(UPLOADS_BASE_PATH, caminho_pasta).replace("\\", "/")

    if not os.path.isdir(pasta_absoluta):
        raise Exception(f"Pasta '{pasta_absoluta}' não encontrada no sistema.")

    imagens = [
        f for f in os.listdir(pasta_absoluta)
        if f.lower().endswith(('.webp', '.jpg', '.jpeg', '.png'))
    ]
    num_paginas = len(imagens)

    # Garante que salvamos no banco com prefixo correto
    pasta_relativa = f"/static/{caminho_pasta}".replace("//", "/")

    db_capitulo = models.Capitulo(
        manga_id=capitulo.manga_id,
        numero=capitulo.numero,
        pasta=pasta_relativa,
        paginas=num_paginas
    )
    db.add(db_capitulo)
    db.commit()
    db.refresh(db_capitulo)
    return db_capitulo

# --------------------------------------------------
# 📚 Lista todos os capítulos de um mangá
# --------------------------------------------------
def get_capitulos_por_manga(db: Session, manga_id: int):
    return db.query(models.Capitulo).filter(models.Capitulo.manga_id == manga_id).all()

# --------------------------------------------------
# 📘 Retorna um capítulo específico de um mangá por número
# --------------------------------------------------
def get_capitulo_por_numero(db: Session, manga_id: int, numero: int):
    return db.query(models.Capitulo).filter(
        models.Capitulo.manga_id == manga_id,
        models.Capitulo.numero == numero
    ).first()
