from api.config.client import supabase_client
from fastapi import HTTPException

supabase = supabase_client()

def get_users():
    response = supabase.table('users').select('*').execute()

    return {
        "message": 'Heres the list of users',
        "data": response.data
    }