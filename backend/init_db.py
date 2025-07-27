from models import Base
from database import engine

print("Criando as tabelas no banco de dados...")
Base.metadata.create_all(bind=engine)
print("Tabelas criadas com sucesso.")
