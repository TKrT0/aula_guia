-- ================================================
-- FASE 1: Sistema Multi-Carrera y Periodos
-- Ejecutar en Supabase SQL Editor
-- ================================================

-- 1. Crear tabla de carreras
CREATE TABLE IF NOT EXISTS carreras (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  facultad TEXT DEFAULT 'Facultad de Ciencias de la Computación',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar carreras de la FCC
INSERT INTO carreras (id, nombre) VALUES
  ('ICC', 'Ingeniería en Ciencias de la Computación'),
  ('LICC', 'Licenciatura en Ciencias de la Computación'),
  ('ITI', 'Ingeniería en Tecnologías de la Información')
ON CONFLICT (id) DO NOTHING;

-- 2. Crear tabla de periodos
CREATE TABLE IF NOT EXISTS periodos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  fecha_inicio DATE,
  fecha_fin DATE,
  activo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar periodo activo (Primavera 2026)
INSERT INTO periodos (id, nombre, activo) VALUES
  ('PA2026', 'Primavera 2026', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Agregar columna carrera_id a materias (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'materias' AND column_name = 'carrera_id'
  ) THEN
    ALTER TABLE materias ADD COLUMN carrera_id TEXT REFERENCES carreras(id);
  END IF;
END $$;

-- 4. Agregar columna periodo_id a horarios_materia (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'horarios_materia' AND column_name = 'periodo_id'
  ) THEN
    ALTER TABLE horarios_materia ADD COLUMN periodo_id TEXT REFERENCES periodos(id);
  END IF;
END $$;

-- 5. Actualizar la vista buscador para incluir carrera
DROP VIEW IF EXISTS vista_buscador;

CREATE VIEW vista_buscador AS
SELECT 
    p.id AS profesor_id,
    p.nombre AS profesor_nombre,
    p.facultad,
    m.id AS materia_id,
    m.nombre AS materia_nombre,
    m.nrc,
    m.clave,
    m.carrera_id,
    c.nombre AS carrera_nombre,
    COALESCE(
        (SELECT AVG(r.puntuacion_general) FROM resenas r WHERE r.profesor_id = p.id),
        0
    ) AS rating_promedio,
    COALESCE(
        (SELECT AVG(r.dificultad) FROM resenas r WHERE r.profesor_id = p.id),
        0
    ) AS dificultad_promedio,
    COALESCE(
        (SELECT 
            ROUND(COUNT(*) FILTER (WHERE r.puntuacion_general >= 3) * 100.0 / NULLIF(COUNT(*), 0))
         FROM resenas r WHERE r.profesor_id = p.id),
        0
    ) AS recomendacion_pct
FROM materias m
JOIN profesores p ON m.profesor_id = p.id
LEFT JOIN carreras c ON m.carrera_id = c.id;

-- 6. Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_materias_carrera ON materias(carrera_id);
CREATE INDEX IF NOT EXISTS idx_horarios_periodo ON horarios_materia(periodo_id);

-- ================================================
-- VERIFICACIÓN: Ejecutar después para confirmar
-- ================================================
-- SELECT * FROM carreras;
-- SELECT * FROM periodos;
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'materias';
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'horarios_materia';
