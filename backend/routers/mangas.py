from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.orm import Session
import schemas, crud, models
from database import SessionLocal, engine
import os
from uuid import uuid4
from fastapi import HTTPException
from fastapi.responses import JSONResponse


# ✅ Caminho base onde os capítulos estão armazenados no seu disco
UPLOADS_BASE_PATH = "C:/Temp/Uploads/Mangas"

# Inicializa o roteador de mangás
router = APIRouter(
    prefix="/api/mangas",
    tags=["mangas"]
)

# Cria as tabelas no banco, se ainda não existirem
models.Base.metadata.create_all(bind=engine)

# Dependência para pegar uma sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rota GET - retorna os dados de um único mangá pelo ID
@router.get("/{manga_id}", response_model=schemas.Manga)
def obter_manga(manga_id: int, db: Session = Depends(get_db)):
    manga = crud.get_manga_by_id(db, manga_id)
    if not manga:
        raise HTTPException(status_code=404, detail="Mangá não encontrado")
    return manga

# Rota GET - retorna todos os mangás
@router.get("/", response_model=list[schemas.Manga])
def listar_mangas(db: Session = Depends(get_db)):
    return crud.get_mangas(db)

# Rota POST - cria novo mangá com imagem
@router.post("/", response_model=schemas.Manga)
def criar_manga(
    titulo: str = Form(...),
    descricao: str = Form(...),
    capa: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Gera um nome único para o arquivo da imagem
    extensao = capa.filename.split('.')[-1]
    filename = f"{uuid4()}.{extensao}"
    caminho = os.path.join("uploads", filename)

    # Salva a imagem na pasta uploads
    with open(caminho, "wb") as f:
        f.write(capa.file.read())

    # Cria o objeto Manga no banco
    manga_data = schemas.MangaCreate(titulo=titulo, descricao=descricao)
    return crud.create_manga(db, manga_data, capa_filename=f"/uploads/{filename}")


# Rota POST - cria um novo capítulo
@router.post("/{manga_id}/capitulos", response_model=schemas.Capitulo)
def criar_capitulo(
    manga_id: int,
    numero: int = Form(...),
    pasta: str = Form(...),
    db: Session = Depends(get_db)
):
    # Verifica se o mangá existe
    manga = crud.get_manga_by_id(db, manga_id)
    if not manga:
        raise HTTPException(status_code=404, detail="Mangá não encontrado")

    # Cria o capítulo
    cap_data = schemas.CapituloCreate(manga_id=manga_id, numero=numero, pasta=pasta)
    return crud.create_capitulo(db, cap_data)

# Rota GET - lista todos os capítulos de um mangá
@router.get("/{manga_id}/capitulos", response_model=list[schemas.Capitulo])
def listar_capitulos(manga_id: int, db: Session = Depends(get_db)):
    return crud.get_capitulos_por_manga(db, manga_id)


@router.get("/{manga_id}/capitulos/{numero}/imagens")
def listar_imagens_do_capitulo(manga_id: int, numero: int, db: Session = Depends(get_db)):
    # Pega o capítulo no banco
    capitulo = crud.get_capitulo_por_numero(db, manga_id, numero)
    if not capitulo:
        raise HTTPException(status_code=404, detail="Capítulo não encontrado")

    # Monta o caminho absoluto da pasta onde estão as imagens
    pasta_absoluta = os.path.join(UPLOADS_BASE_PATH, capitulo.pasta)

    if not os.path.isdir(pasta_absoluta):
        raise HTTPException(status_code=404, detail="Pasta de imagens não encontrada")

    # Lista as imagens (filtra apenas arquivos de imagem comuns)
    imagens = [
        f"/static/{capitulo.pasta}/{f}"
        for f in sorted(os.listdir(pasta_absoluta))
        if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
    ]

    return JSONResponse(content={"imagens": imagens})