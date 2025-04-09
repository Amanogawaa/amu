from supabase import create_client, Client
from groq import Groq
from api.config.env import GROQ_API_KEY, SUPABASE_URL, SUPABASE_KEY

key: str = SUPABASE_KEY
url: str = SUPABASE_URL
groq_key: str = GROQ_API_KEY

def supabase_client() -> Client:
    supabase: Client = create_client(supabase_key=key, supabase_url=url)
    return supabase

def groq_client() -> Groq:
    client = Groq(api_key=groq_key)
    return client
