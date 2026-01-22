import pdfplumber
import re

def limpiar_texto(texto):
    if not texto: return ""
    return " ".join(texto.split())

def extraer_datos_pdf(ruta_pdf):
    resultados = []
    # Expresión regular ajustada a tu formato: NRC Clave Materia Secc Dias Hora Profesor Salon
    patron = r"(\d{5})\s+([A-Z]{4}\s\d{3})\s+(.+?)\s+([LMXJVS]+)\s+(\d{4}-\d{4})\s+(.+)"

    with pdfplumber.open(ruta_pdf) as pdf:
        for pagina in pdf.pages:
            texto = pagina.extract_text()
            if not texto: continue
            
            for linea in texto.split('\n'):
                match = re.search(patron, linea)
                if match:
                    # Extracción de grupos
                    profe_salon_raw = match.group(6).rsplit(' ', 1)
                    
                    # Formatear horas para Supabase (HH:MM:SS)
                    h_raw = match.group(5).split('-')
                    h_inicio = f"{h_raw[0][:2]}:{h_raw[0][2:]}:00"
                    h_fin = f"{h_raw[1][:2]}:{h_raw[1][2:]}:00"

                    datos = {
                        "nrc": match.group(1),
                        "clave": match.group(2),
                        "materia": match.group(3).rsplit(' ', 1)[0],
                        "seccion": match.group(3).rsplit(' ', 1)[1],
                        "dias": list(match.group(4)), # Convierte "LMX" en ['L', 'M', 'X']
                        "hora_inicio": h_inicio,
                        "hora_fin": h_fin,
                        "profesor": profe_salon_raw[0],
                        "salon": profe_salon_raw[1] if len(profe_salon_raw) > 1 else "S/N"
                    }
                    resultados.append(datos)
    return resultados