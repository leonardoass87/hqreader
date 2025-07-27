from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
import models
import jwt
import datetime
import os

# Segredo usado para gerar o token JWT
SECRET_KEY = os.getenv("SECRET_KEY", "segredo_super_secreto")

# Cria o grupo de rotas com prefixo "/api/admin"
router = APIRouter(
    prefix="/api/admin",
    tags=["admin"]
)

# Define o modelo de entrada esperado no corpo da requisição (JSON)
class AdminLogin(BaseModel):
    email: str
    senha: str

# Endpoint de login do admin
@router.post("/login")
def admin_login(
    dados: AdminLogin,  # Recebe os dados em JSON: { "email": "...", "senha": "..." }
    db: Session = Depends(get_db)
):
    try:
        # Busca um admin com o email e senha informados
        admin = db.query(models.Admin).filter(
            models.Admin.email == dados.email,
            models.Admin.senha == dados.senha  # Em produção, use hash!
        ).first()

        if not admin:
            # Retorna erro 401 se não encontrar o admin
            raise HTTPException(status_code=401, detail="Credenciais inválidas")

        # Gera o token JWT com validade de 24 horas
        payload = {
            "sub": admin.id,
            "email": admin.email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        # Retorna o token
        return {"access_token": token}

    except Exception as e:
        # Em caso de erro inesperado, retorna erro 500
        raise HTTPException(status_code=500, detail=f"Erro no login: {str(e)}")
