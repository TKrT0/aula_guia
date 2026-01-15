import os
from dotenv import load_dotenv
from supabase import Client, create_client

script_dir = os.path.dirname(__file__)
env_path = os.path.join(script_dir, '.env')
load_dotenv(env_path)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

if not url or not key:
    raise ValueError("Error: No se encontraron las variables SUPABASE_URL o SUPABASE_KEY en el .env")

supabase: Client = create_client(url, key)

def insertar_datos():
    data = supabase.table("tareas").insert({"titulo": "Prueba desde Python"}).execute()
    print("¡Datos enviados con éxito!")
    print(data)

if __name__ == "__main__":
    insertar_datos()