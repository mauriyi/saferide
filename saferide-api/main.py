from fastapi import FastAPI
from auth import auth_router
from protected import protected_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS para permitir todos los orígenes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes
    allow_credentials=True,  # Permitir cookies y credenciales
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todas las cabeceras
)

# Incluye el router de autenticación
app.include_router(auth_router)

# Incluye el router de rutas protegidas
app.include_router(protected_router)
