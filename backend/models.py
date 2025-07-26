from sqlalchemy import Column, Integer, String, ForeignKey
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

    # id = Column(Integer, primary_key=True, index=True)
    # manga_id = Column(Integer, ForeignKey("mangas.id"))
    # numero = Column(Integer)
    # pasta = Column(String)

    # # Relacionamento reverso: o capítulo pertence a um mangá
    # manga = relationship("Manga", back_populates="capitulos")
