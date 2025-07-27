from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import schemas, crud, models
from database import SessionLocal, engine
import os
from uuid import uuid4
from typing import List

# Caminho onde os capítulos (imagens) estão armazenados no disco
UPLOADS_BASE_PATH = "C:/Temp/Uploads/Mangas"

# Inicializa o roteador de mangás
router = APIRouter(
    prefix="/api/mangas",
    tags=["mangas"]
)



# Cria as tabelas no banco de dados (executa uma única vez ao subir o servidor)
models.Base.metadata.create_all(bind=engine)

# Dependência para obter uma sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------------------------------------
# GET /api/mangas/{manga_id} - Retorna um único mangá
# -------------------------------------------------------
@router.get("/{manga_id}", response_model=schemas.Manga)
def obter_manga(manga_id: int, db: Session = Depends(get_db)):
    manga = crud.get_manga_by_id(db, manga_id)
    if not manga:
        raise HTTPException(status_code=404, detail="Mangá não encontrado")
    return manga

# -------------------------------------------------------
# GET /api/mangas - Lista todos os mangás cadastrados
# -------------------------------------------------------
@router.get("/", response_model=list[schemas.Manga])
def listar_mangas(db: Session = Depends(get_db)):
    try:
        return crud.get_mangas(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar mangás: {str(e)}")

# -------------------------------------------------------
# POST /api/mangas - Cria novo mangá com imagem de capa
# -------------------------------------------------------
@router.post("/", response_model=schemas.Manga)
def criar_manga(
    titulo: str = Form(...),
    descricao: str = Form(...),
    capa: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        # Gera nome de arquivo único para a imagem
        extensao = capa.filename.split('.')[-1]
        filename = f"{uuid4()}.{extensao}"
        caminho = os.path.join("uploads", filename)

        # Salva a imagem na pasta local "uploads"
        with open(caminho, "wb") as f:
            f.write(capa.file.read())

        # Cria o mangá no banco de dados
        manga_data = schemas.MangaCreate(titulo=titulo, descricao=descricao)
        novo_manga = crud.create_manga(db, manga_data, capa_filename=f"/uploads/{filename}")
        return novo_manga

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar mangá: {str(e)}")

# -------------------------------------------------------
# -------------------------------------------------------
# POST /api/mangas/{id}/capitulos/upload - Envia imagens e cria capítulo
# -------------------------------------------------------
@router.post("/{manga_id}/capitulos/upload")
def upload_capitulo_com_imagens(
    manga_id: int,
    numero: int = Form(...),
    imagens: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    # Verifica se o mangá existe no banco de dados
    manga = crud.get_manga_by_id(db, manga_id)
    if not manga:
        raise HTTPException(status_code=404, detail="Mangá não encontrado")

    # Define nome da pasta do capítulo (usada também como slug de acesso via /static)
    pasta_relativa = f"manga_{manga_id}_cap_{numero}"
    pasta_absoluta = os.path.join(UPLOADS_BASE_PATH, pasta_relativa)
    os.makedirs(pasta_absoluta, exist_ok=True)

    # Salva e renomeia as imagens como 001.webp, 002.webp, etc.
    for i, imagem in enumerate(imagens, start=1):
        extensao = imagem.filename.split('.')[-1]
        nome_padronizado = f"{str(i).zfill(3)}.{extensao}"
        caminho_arquivo = os.path.join(pasta_absoluta, nome_padronizado)

        with open(caminho_arquivo, "wb") as f:
            f.write(imagem.file.read())

    # Cria o capítulo no banco com o caminho relativo da pasta
    capitulo_data = schemas.CapituloCreate(
        manga_id=manga_id,
        numero=numero,
        pasta=f"/static/{pasta_relativa}"
    )
    capitulo = crud.create_capitulo(db, capitulo_data)

    return {"mensagem": "Capítulo enviado com sucesso", "capitulo_id": capitulo.id}


# -------------------------------------------------------
# GET /api/mangas/{id}/capitulos - Lista capítulos de um mangá
# -------------------------------------------------------
@router.get("/{manga_id}/capitulos", response_model=list[schemas.Capitulo])
def listar_capitulos(manga_id: int, db: Session = Depends(get_db)):
    return crud.get_capitulos_por_manga(db, manga_id)

# -------------------------------------------------------
# GET /api/mangas/{id}/capitulos/{numero}/imagens
# Retorna a lista de imagens de um capítulo
# -------------------------------------------------------
@router.get("/{manga_id}/capitulos/{numero}/imagens")
def listar_imagens_do_capitulo(manga_id: int, numero: int, db: Session = Depends(get_db)):
    # Busca o capítulo no banco de dados
    capitulo = crud.get_capitulo_por_numero(db, manga_id, numero)
    if not capitulo:
        raise HTTPException(status_code=404, detail="Capítulo não encontrado")

    # Caminho físico da pasta onde estão as imagens do capítulo
    pasta_absoluta = os.path.join(UPLOADS_BASE_PATH, capitulo.pasta)

    if not os.path.isdir(pasta_absoluta):
        raise HTTPException(status_code=404, detail="Pasta de imagens não encontrada")

    # Lista as imagens da pasta (filtrando formatos comuns)
    imagens = [
        f"/static/{capitulo.pasta}/{f}"
        for f in sorted(os.listdir(pasta_absoluta))
        if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
    ]

    return JSONResponse(content={"imagens": imagens})

# -------------------------------------------------------
# POST /api/mangas/{id}/capitulos/upload
# Envia um capítulo com múltiplas imagens e cria pasta automaticamente
# -------------------------------------------------------
@router.post("/{manga_id}/capitulos/upload")
def upload_capitulo_com_imagens(
    manga_id: int,
    numero: int = Form(...),
    imagens: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    try:
        # Verifica se o mangá existe
        manga = crud.get_manga_by_id(db, manga_id)
        if not manga:
            raise HTTPException(status_code=404, detail="Mangá não encontrado")

        # Gera o nome da pasta com base no ID do mangá e número do capítulo
        pasta_nome = f"manga_{manga_id}_cap_{numero}"
        pasta_destino = os.path.join(UPLOADS_BASE_PATH, pasta_nome)

        os.makedirs(pasta_destino, exist_ok=True)

        # Salva as imagens
        for imagem in imagens:
            extensao = imagem.filename.split('.')[-1]
            nome_arquivo = f"{uuid4()}.{extensao}"
            caminho_arquivo = os.path.join(pasta_destino, nome_arquivo)
            with open(caminho_arquivo, "wb") as f:
                f.write(imagem.file.read())

        # Cria o capítulo no banco
        capitulo_data = schemas.CapituloCreate(
            manga_id=manga_id,
            numero=numero,
            pasta=pasta_destino
        )
        capitulo = crud.create_capitulo(db, capitulo_data)

        return {"mensagem": "Capítulo enviado com sucesso", "capitulo_id": capitulo.id}

    except Exception as e:
        print(f"[ERRO] Falha ao enviar capítulo: {str(e)}")  # 👈 Log local
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")
    
    # -------------------------------------------------------
# DELETE /api/mangas/{id} - Remove um mangá
# -------------------------------------------------------
@router.delete("/{manga_id}")
def deletar_manga(manga_id: int, db: Session = Depends(get_db)):
    manga = crud.get_manga_by_id(db, manga_id)
    if not manga:
        raise HTTPException(status_code=404, detail="Mangá não encontrado")

    db.delete(manga)
    db.commit()
    return {"mensagem": "Mangá deletado com sucesso"}

