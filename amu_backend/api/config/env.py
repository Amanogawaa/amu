from dotenv import load_dotenv
import os

env = os.environ.get('PYTHON_ENV', 'development')

load_dotenv(
   dotenv_path=f'.env.{env}.local'
)

GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

