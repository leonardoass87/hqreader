from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy import DateTime, func
from sqlalchemy.orm import relationship
from database import Base

# Modelo da tabela "mangas"
class Manga(Base):
    __tablename__ = "mangas"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True)
    descricao = Column(String)
    capa = Column(String)

    # Relacionamento: um mangá tem vários capítulos
    capitulos = relationship("Capitulo", back_populates="manga")

# Modelo da tabela "capitulos"
class Capitulo(Base):
    __tablename__ = "capitulos"
    id = Column(Integer, primary_key=True, index=True)
    manga_id = Column(Integer, ForeignKey("mangas.id"))
    numero = Column(Integer)
    pasta = Column(String)
    paginas = Column(Integer)  # ✅ Número de páginas
    manga = relationship("Manga", back_populates="capitulos")

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    senha = Column(String, nullable=False)

# Modelo da tabela "views"
class View(Base):
    __tablename__ = "views"

    id = Column(Integer, primary_key=True, index=True)
    manga_id = Column(Integer, ForeignKey("mangas.id"))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamento reverso (opcional)
    manga = relationship("Manga", backref="views")