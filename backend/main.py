from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import mangas, admin  # ✅ Inclui o admin aqui
import os
import jwt


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["*"] para liberar tudo (não recomendado em prod)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Rotas de Admin
app.include_router(admin.router)

# 👇 Adicione esta configuração logo após criar a instância `app`


# ✅ Rotas de Mangás
app.include_router(mangas.router)

# ✅ Pasta de imagens dos capítulos
app.mount("/static", StaticFiles(directory="C:/Temp/Uploads/Mangas"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
