from fastapi import APIRouter, File, UploadFile
from api.controllers.user_controller import *
from api.controllers.miria_ai import *

Routes = APIRouter() 

@Routes.get('/auth', tags=['auth'])
async def users():
    return get_users()


@Routes.post('/bot/miria', tags=['miria ai'])
async def summarizer(file: UploadFile = File(None)):
    return summarize(file)