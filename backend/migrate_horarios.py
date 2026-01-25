# -*- coding: utf-8 -*-
"""
Script de migracion de datos: CSV -> Supabase
Borra datos existentes e inserta nuevos desde el CSV de horarios.
Ejecutar: python backend/migrate_horarios.py
"""

import csv
import os
import time
from supabase import create_client, Client

# Configuracion de Supabase (usar variables de entorno o valores directos)
SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL', 'https://lfrqiihsfwyegefxdikx.supabase.co')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmcnFpaWhzZnd5ZWdlZnhkaWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODM1Njk1NSwiZXhwIjoyMDgzOTMyOTU1fQ.rxrUJeyYF3_PoPmJB9iJzFfECrfpw3rHGmCPmG4Dh4c')

BATCH_SIZE = 20
CSV_PATH = 'backend/data/horarios_licc_pa2026.csv'

# Mapeo de dias
DIA_MAP = {
    'L': 'lunes',
    'A': 'martes',
    'M': 'miercoles',
    'J': 'jueves',
    'V': 'viernes',
    'S': 'sabado'
}

def parse_hora(hora_raw: str) -> tuple:
    """Convierte '1600-1659' a ('16:00:00', '16:59:00')"""
    inicio, fin = hora_raw.split('-')
    hora_inicio = f"{inicio[:2]}:{inicio[2:]}:00"
    hora_fin = f"{fin[:2]}:{fin[2:]}:00"
    return hora_inicio, hora_fin

def batch_insert(supabase: Client, table: str, data: list, batch_size: int = BATCH_SIZE):
    """Inserta datos en batches"""
    total = len(data)
    inserted = 0
    
    for i in range(0, total, batch_size):
        batch = data[i:i + batch_size]
        try:
            result = supabase.table(table).insert(batch).execute()
            inserted += len(batch)
            print(f"  [{table}] Insertados {inserted}/{total}")
            time.sleep(0.3)
        except Exception as e:
            print(f"  [ERROR] Error en batch {i}-{i+batch_size}: {e}")
            raise
    
    return inserted

def main():
    print("=" * 60)
    print("[*] Migracion de Horarios - CSV -> Supabase")
    print("=" * 60)
    
    # Conectar a Supabase
    print("\n[+] Conectando a Supabase...")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("   [OK] Conectado!")
    
    # 1. Leer CSV
    print(f"\n[+] Leyendo CSV: {CSV_PATH}")
    with open(CSV_PATH, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    print(f"   [OK] {len(rows)} filas leidas")
    
    # 2. Extraer datos unicos
    print("\n[+] Procesando datos...")
    
    # Profesores unicos
    profesores_set = set()
    for row in rows:
        profesores_set.add(row['Profesor'].strip())
    
    # Materias unicas (por NRC)
    materias_dict = {}
    for row in rows:
        nrc = row['NRC'].strip()
        if nrc not in materias_dict:
            materias_dict[nrc] = {
                'nrc': nrc,
                'clave': row['Clave'].strip(),
                'nombre': row['Materia'].strip(),
                'seccion': row['Secc'].strip(),
                'profesor_nombre': row['Profesor'].strip()
            }
    
    print(f"   - Profesores unicos: {len(profesores_set)}")
    print(f"   - Materias unicas (NRC): {len(materias_dict)}")
    print(f"   - Bloques de horario: {len(rows)}")
    
    # 3. Borrar datos existentes (en orden inverso por FK)
    print("\n[-] Borrando datos existentes...")
    
    print("   Borrando horarios_materia...")
    supabase.table('horarios_materia').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
    print("   [OK] horarios_materia vaciada")
    
    print("   Borrando materias...")
    supabase.table('materias').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
    print("   [OK] materias vaciada")
    
    print("   Borrando profesores...")
    supabase.table('profesores').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
    print("   [OK] profesores vaciada")
    
    # 4. Insertar profesores
    print("\n[+] Insertando profesores...")
    profesores_data = [
        {
            'nombre': nombre,
            'facultad': 'Facultad de Ciencias de la Computacion',
            'metodo_predominante': None
        }
        for nombre in profesores_set
    ]
    batch_insert(supabase, 'profesores', profesores_data)
    
    # Obtener IDs de profesores
    print("   Obteniendo IDs de profesores...")
    prof_result = supabase.table('profesores').select('id, nombre').execute()
    profesor_id_map = {p['nombre']: p['id'] for p in prof_result.data}
    print(f"   [OK] {len(profesor_id_map)} profesores mapeados")
    
    # 5. Insertar materias
    print("\n[+] Insertando materias...")
    materias_data = []
    for nrc, mat in materias_dict.items():
        profesor_id = profesor_id_map.get(mat['profesor_nombre'])
        if not profesor_id:
            print(f"   [!] Profesor no encontrado: {mat['profesor_nombre']}")
            continue
        
        materias_data.append({
            'nrc': mat['nrc'],
            'clave': mat['clave'],
            'nombre': mat['nombre'],
            'seccion': mat['seccion'],
            'profesor_id': profesor_id,
            'cupos_max': None,
            'cupos_disponibles': None
        })
    
    batch_insert(supabase, 'materias', materias_data)
    
    # Obtener IDs de materias
    print("   Obteniendo IDs de materias...")
    mat_result = supabase.table('materias').select('id, nrc').execute()
    materia_id_map = {m['nrc']: m['id'] for m in mat_result.data}
    print(f"   [OK] {len(materia_id_map)} materias mapeadas")
    
    # 6. Insertar bloques de horario
    print("\n[+] Insertando bloques de horario...")
    horarios_data = []
    for row in rows:
        nrc = row['NRC'].strip()
        materia_id = materia_id_map.get(nrc)
        
        if not materia_id:
            print(f"   [!] Materia no encontrada para NRC: {nrc}")
            continue
        
        dia = DIA_MAP.get(row['Dias'].strip())
        if not dia:
            print(f"   [!] Dia no mapeado: {row['Dias']}")
            continue
        
        hora_inicio, hora_fin = parse_hora(row['Hora'].strip())
        
        horarios_data.append({
            'materia_id': materia_id,
            'nrc': nrc,
            'dia': dia,
            'hora_inicio': hora_inicio,
            'hora_fin': hora_fin,
            'salon': row['Salon'].strip(),
            'edificio': None
        })
    
    batch_insert(supabase, 'horarios_materia', horarios_data)
    
    # Resumen final
    print("\n" + "=" * 60)
    print("[OK] MIGRACION COMPLETADA")
    print("=" * 60)
    print(f"   - Profesores: {len(profesores_data)}")
    print(f"   - Materias: {len(materias_data)}")
    print(f"   - Bloques de horario: {len(horarios_data)}")
    print("\n[DONE] Listo! Puedes verificar en Supabase.")

if __name__ == '__main__':
    main()
