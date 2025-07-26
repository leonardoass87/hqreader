from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ✅ CORS vem logo após os imports principais
from routers import mangas
from fastapi.staticfiles import StaticFiles
from fastapi.staticfiles import StaticFiles
import os


app = FastAPI()


# Configuração manual (sem settings.py)
app.mount(
    "/static",
    StaticFiles(directory="C:/Temp/Uploads/Mangas"),
    name="static"
)

# ✅ Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Durante o dev, pode deixar assim. Depois defina os domínios específicos.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Inclui as rotas dos mangás
app.include_router(mangas.router)

# ✅ Serve a pasta de imagens (capas e capítulos)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
