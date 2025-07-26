import os
from sqlalchemy.orm import Session
import models, schemas

# Retorna todos os mangás com seus capítulos
def get_mangas(db: Session):
    return db.query(models.Manga).all()

# Retorna um único mangá por ID, com seus capítulos
def get_manga_by_id(db: Session, manga_id: int):
    return db.query(models.Manga).filter(models.Manga.id == manga_id).first()

# Cria um novo mangá
def create_manga(db: Session, manga: schemas.MangaCreate, capa_filename: str):
    db_manga = models.Manga(**manga.dict(), capa=capa_filename)
    db.add(db_manga)
    db.commit()
    db.refresh(db_manga)
    return db_manga

# Cria um novo capítulo com contagem de páginas
def create_capitulo(db: Session, capitulo: schemas.CapituloCreate):
    pasta_absoluta = capitulo.pasta.replace("\\", "/")

    if not os.path.isdir(pasta_absoluta):
        raise Exception(f"Pasta '{pasta_absoluta}' não encontrada no sistema.")

    # Filtra somente arquivos de imagem
    imagens = [f for f in os.listdir(pasta_absoluta) if f.lower().endswith(('.webp', '.jpg', '.jpeg', '.png'))]
    num_paginas = len(imagens)

    db_capitulo = models.Capitulo(
        manga_id=capitulo.manga_id,
        numero=capitulo.numero,
        pasta=capitulo.pasta,
        paginas=num_paginas  # ← campo preenchido automaticamente
    )
    db.add(db_capitulo)
    db.commit()
    db.refresh(db_capitulo)
    return db_capitulo

# Lista todos os capítulos de um mangá
def get_capitulos_por_manga(db: Session, manga_id: int):
    return db.query(models.Capitulo).filter(models.Capitulo.manga_id == manga_id).all()
