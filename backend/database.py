from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Caminho do banco de dados SQLite local
SQLALCHEMY_DATABASE_URL = "sqlite:///./mangas.db"

# Cria o engine (conexão com SQLite)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Cria a sessão que será usada nos endpoints
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos
Base = declarative_base()

# ✅ Função usada para injetar o banco nos endpoints (ex: Depends(get_db))
def get_db():
    """
    Cria uma sessão de banco de dados e garante que ela será fechada corretamente após o uso.
    Use com Depends(get_db) nos endpoints FastAPI.
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
