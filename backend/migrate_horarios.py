# -*- coding: utf-8 -*-
"""
Script de migracion de datos: CSV -> Supabase (Multi-Carrera)
Soporta carrera_id y periodo_id para el sistema multi-carrera.
Ejecutar: python backend/migrate_horarios.py [CARRERA_ID] [PERIODO_ID]
Ejemplo:  python backend/migrate_horarios.py LICC PA2026
"""

import csv
import os
import sys
import time
from supabase import create_client, Client

# Configuracion de Supabase
SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL', 'https://lfrqiihsfwyegefxdikx.supabase.co')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmcnFpaWhzZnd5ZWdlZnhkaWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODM1Njk1NSwiZXhwIjoyMDgzOTMyOTU1fQ.rxrUJeyYF3_PoPmJB9iJzFfECrfpw3rHGmCPmG4Dh4c')

BATCH_SIZE = 20

# Mapeo de dias
DIA_MAP = {
    'L': 'lunes',
    'A': 'martes',
    'M': 'miercoles',
    'J': 'jueves',
    'V': 'viernes',
    'S': 'sabado'
}

# Configuracion de carreras y sus archivos CSV
CARRERAS_CONFIG = {
    'ICC': {
        'nombre': 'Ingenieria en Ciencias de la Computacion',
        'csv': 'backend/data/horarios_icc_pa2026.csv'
    },
    'LICC': {
        'nombre': 'Licenciatura en Ciencias de la Computacion',
        'csv': 'backend/data/horarios_licc_pa2026.csv'
    },
    'ITI': {
        'nombre': 'Ingenieria en Tecnologias de la Informacion',
        'csv': 'backend/data/horarios_iti_pa2026.csv'
    }
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
            supabase.table(table).insert(batch).execute()
            inserted += len(batch)
            print(f"  [{table}] Insertados {inserted}/{total}")
            time.sleep(0.3)
        except Exception as e:
            print(f"  [ERROR] Error en batch {i}-{i+batch_size}: {e}")
            raise
    
    return inserted

def migrate_carrera(supabase: Client, carrera_id: str, periodo_id: str, csv_path: str, borrar_existentes: bool = False):
    """Migra datos de una carrera especifica"""
    
    print(f"\n{'='*60}")
    print(f"[*] Migrando: {carrera_id} - Periodo: {periodo_id}")
    print(f"    CSV: {csv_path}")
    print(f"{'='*60}")
    
    # Verificar que el archivo existe
    if not os.path.exists(csv_path):
        print(f"   [ERROR] Archivo no encontrado: {csv_path}")
        return False
    
    # 1. Leer CSV
    print(f"\n[+] Leyendo CSV...")
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    print(f"   [OK] {len(rows)} filas leidas")
    
    # 2. Extraer datos unicos
    print("\n[+] Procesando datos...")
    
    # Profesores unicos (pueden existir ya)
    profesores_set = set()
    for row in rows:
        prof = row.get('Profesor', '').strip()
        if prof:
            profesores_set.add(prof)
    
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
                'profesor_nombre': row.get('Profesor', '').strip()
            }
    
    print(f"   - Profesores unicos: {len(profesores_set)}")
    print(f"   - Materias unicas (NRC): {len(materias_dict)}")
    print(f"   - Bloques de horario: {len(rows)}")
    
    # 3. Borrar datos existentes de esta carrera/periodo si se solicita
    if borrar_existentes:
        print(f"\n[-] Borrando datos existentes de {carrera_id}...")
        
        # Obtener materias de esta carrera
        materias_existentes = supabase.table('materias').select('id').eq('carrera_id', carrera_id).execute()
        if materias_existentes.data:
            materia_ids = [m['id'] for m in materias_existentes.data]
            
            # Borrar horarios de este periodo para estas materias
            for mid in materia_ids:
                supabase.table('horarios_materia').delete().eq('materia_id', mid).eq('periodo_id', periodo_id).execute()
            
            # Borrar materias de esta carrera
            supabase.table('materias').delete().eq('carrera_id', carrera_id).execute()
        
        print(f"   [OK] Datos de {carrera_id}/{periodo_id} eliminados")
    
    # 4. Insertar/Actualizar profesores (upsert por nombre)
    print("\n[+] Procesando profesores...")
    
    # Obtener profesores existentes
    prof_result = supabase.table('profesores').select('id, nombre').execute()
    profesor_id_map = {p['nombre']: p['id'] for p in prof_result.data}
    
    # Insertar nuevos profesores
    nuevos_profesores = []
    for nombre in profesores_set:
        if nombre and nombre not in profesor_id_map:
            nuevos_profesores.append({
                'nombre': nombre,
                'facultad': 'Facultad de Ciencias de la Computacion',
                'metodo_predominante': None
            })
    
    if nuevos_profesores:
        batch_insert(supabase, 'profesores', nuevos_profesores)
        # Actualizar mapa
        prof_result = supabase.table('profesores').select('id, nombre').execute()
        profesor_id_map = {p['nombre']: p['id'] for p in prof_result.data}
    
    print(f"   [OK] {len(nuevos_profesores)} nuevos profesores, {len(profesor_id_map)} total")
    
    # 5. Insertar materias con carrera_id
    print(f"\n[+] Insertando materias para {carrera_id}...")
    materias_data = []
    for nrc, mat in materias_dict.items():
        profesor_id = profesor_id_map.get(mat['profesor_nombre'])
        if not profesor_id and mat['profesor_nombre']:
            print(f"   [!] Profesor no encontrado: {mat['profesor_nombre']}")
            continue
        
        materias_data.append({
            'nrc': mat['nrc'],
            'clave': mat['clave'],
            'nombre': mat['nombre'],
            'seccion': mat['seccion'],
            'profesor_id': profesor_id,
            'carrera_id': carrera_id,
            'cupos_max': None,
            'cupos_disponibles': None
        })
    
    if materias_data:
        batch_insert(supabase, 'materias', materias_data)
    
    # Obtener IDs de materias recien insertadas
    print("   Obteniendo IDs de materias...")
    mat_result = supabase.table('materias').select('id, nrc').eq('carrera_id', carrera_id).execute()
    materia_id_map = {m['nrc']: m['id'] for m in mat_result.data}
    print(f"   [OK] {len(materia_id_map)} materias mapeadas")
    
    # 6. Insertar bloques de horario con periodo_id
    print(f"\n[+] Insertando bloques de horario (periodo: {periodo_id})...")
    horarios_data = []
    
    # Detectar header de dia (puede ser 'Dia' o 'Dias')
    dia_key = 'Dias' if 'Dias' in rows[0] else 'Dia'
    
    for row in rows:
        nrc = row['NRC'].strip()
        materia_id = materia_id_map.get(nrc)
        
        if not materia_id:
            continue
        
        # Parsear días (puede ser uno solo como "L" o combinados como "AJ")
        dias_raw = row[dia_key].strip()
        dias_parseados = []
        
        # Iterar letra por letra para separar días combinados
        for letra in dias_raw:
            if letra in DIA_MAP:
                dias_parseados.append(DIA_MAP[letra])
        
        if not dias_parseados:
            print(f"   [!] Dias no mapeados: {dias_raw}")
            continue
        
        hora_inicio, hora_fin = parse_hora(row['Hora'].strip())
        
        # Crear un bloque por cada día
        for dia in dias_parseados:
            horarios_data.append({
                'materia_id': materia_id,
                'nrc': nrc,
                'dia': dia,
                'hora_inicio': hora_inicio,
                'hora_fin': hora_fin,
                'salon': row['Salon'].strip(),
                'edificio': None,
                'periodo_id': periodo_id
        })
    
    if horarios_data:
        batch_insert(supabase, 'horarios_materia', horarios_data)
    
    # Resumen
    print(f"\n[OK] {carrera_id} migrado exitosamente")
    print(f"   - Materias: {len(materias_data)}")
    print(f"   - Bloques: {len(horarios_data)}")
    
    return True

def main():
    print("=" * 60)
    print("[*] Migracion Multi-Carrera - CSV -> Supabase")
    print("=" * 60)
    
    # Parsear argumentos
    if len(sys.argv) < 3:
        print("\nUso: python migrate_horarios.py <CARRERA_ID> <PERIODO_ID> [--borrar]")
        print("\nCarreras disponibles:")
        for cid, info in CARRERAS_CONFIG.items():
            print(f"  {cid}: {info['nombre']}")
        print("\nEjemplos:")
        print("  python backend/migrate_horarios.py LICC PA2026")
        print("  python backend/migrate_horarios.py ICC PA2026 --borrar")
        print("  python backend/migrate_horarios.py ALL PA2026 --borrar  (migra todas)")
        print("  python backend/migrate_horarios.py LICC PA2026 --limpiar-todo  (limpia TODAS las tablas primero)")
        return
    
    carrera_id = sys.argv[1].upper()
    periodo_id = sys.argv[2].upper()
    borrar = '--borrar' in sys.argv
    limpiar_todo = '--limpiar-todo' in sys.argv
    
    # Conectar a Supabase
    print("\n[+] Conectando a Supabase...")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("   [OK] Conectado!")
    
    # Si se solicita limpiar todo, borrar todas las tablas primero
    if limpiar_todo:
        print("\n[-] LIMPIANDO TODAS LAS TABLAS...")
        print("   Borrando horarios_materia...")
        supabase.table('horarios_materia').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        print("   [OK] horarios_materia vaciada")
        
        print("   Borrando materias...")
        supabase.table('materias').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        print("   [OK] materias vaciada")
        
        print("   Borrando profesores...")
        supabase.table('profesores').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        print("   [OK] profesores vaciada")
        print("\n[OK] Tablas limpias!")
    
    # Migrar
    if carrera_id == 'ALL':
        # Migrar todas las carreras
        for cid, config in CARRERAS_CONFIG.items():
            if os.path.exists(config['csv']):
                migrate_carrera(supabase, cid, periodo_id, config['csv'], borrar)
            else:
                print(f"\n[!] Saltando {cid}: archivo no encontrado ({config['csv']})")
    elif carrera_id in CARRERAS_CONFIG:
        config = CARRERAS_CONFIG[carrera_id]
        migrate_carrera(supabase, carrera_id, periodo_id, config['csv'], borrar)
    else:
        print(f"\n[ERROR] Carrera no encontrada: {carrera_id}")
        print(f"Carreras validas: {', '.join(CARRERAS_CONFIG.keys())}")
        return
    
    print("\n" + "=" * 60)
    print("[DONE] Migracion completada!")
    print("=" * 60)

if __name__ == '__main__':
    main()
