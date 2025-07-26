import os
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Capitulo

db: Session = SessionLocal()

# Atualiza todos os capítulos automaticamente
capitulos = db.query(Capitulo).all()

for capitulo in capitulos:
    caminho = capitulo.pasta.replace("/static/", "")  # Ex: "Kane/Cap1"
    pasta_absoluta = os.path.join("C:/Temp/Uploads/Mangas", caminho)

    if os.path.exists(pasta_absoluta):
        imagens = [f for f in os.listdir(pasta_absoluta) if f.lower().endswith(".webp")]
        capitulo.paginas = len(imagens)
        print(f"✅ Capítulo {capitulo.id} ({capitulo.pasta}) → {capitulo.paginas} páginas.")
    else:
        print(f"❌ Pasta não encontrada: {pasta_absoluta}")

db.commit()
print("🚀 Atualização finalizada.")
