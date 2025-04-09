from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from api.views import Routes

def create_app() -> FastAPI:
    app = FastAPI()


    origins = [
        "http://localhost",
        "http://localhost:5173",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(Routes, prefix="/api")

    print("Server is running...")

    return app

    # Chunchunmaru28

app = create_app()