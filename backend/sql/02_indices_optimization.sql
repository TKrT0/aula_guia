-- ============================================
-- ÍNDICES DE OPTIMIZACIÓN PARA AULA GUÍA
-- ============================================
-- Script listo para ejecutar en Supabase SQL Editor
-- Basado en el esquema real de la base de datos
-- ============================================

-- ============================================
-- ÍNDICES PARA BÚSQUEDA DE PROFESORES/MATERIAS
-- ============================================

-- Índice para búsqueda por nombre de profesor
CREATE INDEX IF NOT EXISTS idx_profesores_nombre 
ON profesores (nombre);

-- Índice para búsqueda por nombre de materia
CREATE INDEX IF NOT EXISTS idx_materias_nombre 
ON materias (nombre);

-- Índice compuesto para filtrar materias por carrera
CREATE INDEX IF NOT EXISTS idx_materias_carrera_nombre 
ON materias (carrera_id, nombre);

-- Índice para relación profesor-materia
CREATE INDEX IF NOT EXISTS idx_materias_profesor_id 
ON materias (profesor_id);

-- Índice para NRC en materias
CREATE INDEX IF NOT EXISTS idx_materias_nrc 
ON materias (nrc);

-- ============================================
-- ÍNDICES PARA HORARIOS DE USUARIO
-- ============================================

-- Índice para obtener horarios de un usuario
CREATE INDEX IF NOT EXISTS idx_horarios_user_id 
ON horarios (user_id);

-- Índice compuesto para horarios activos por usuario
CREATE INDEX IF NOT EXISTS idx_horarios_user_activo 
ON horarios (user_id, es_activo);

-- Índice para ordenar por fecha de actualización
CREATE INDEX IF NOT EXISTS idx_horarios_updated_at 
ON horarios (updated_at DESC);

-- ============================================
-- ÍNDICES PARA HORARIO_MATERIAS (join table)
-- ============================================

-- Índice para materias en un horario específico
CREATE INDEX IF NOT EXISTS idx_horario_materias_horario_id 
ON horario_materias (horario_id);

-- Índice para verificar si una materia ya está en un horario
CREATE INDEX IF NOT EXISTS idx_horario_materias_horario_nrc 
ON horario_materias (horario_id, nrc);

-- Índice para búsqueda por materia_id
CREATE INDEX IF NOT EXISTS idx_horario_materias_materia_id 
ON horario_materias (materia_id);

-- ============================================
-- ÍNDICES PARA HORARIOS_MATERIA (bloques de horario)
-- ============================================

-- Índice para obtener bloques por NRC
CREATE INDEX IF NOT EXISTS idx_horarios_materia_nrc 
ON horarios_materia (nrc);

-- Índice compuesto para detección de conflictos
CREATE INDEX IF NOT EXISTS idx_horarios_materia_dia_horas 
ON horarios_materia (dia, hora_inicio, hora_fin);

-- Índice para bloques por materia
CREATE INDEX IF NOT EXISTS idx_horarios_materia_materia_id 
ON horarios_materia (materia_id);

-- Índice para filtrar por periodo
CREATE INDEX IF NOT EXISTS idx_horarios_materia_periodo 
ON horarios_materia (periodo_id);

-- ============================================
-- ÍNDICES PARA RESEÑAS Y CALIFICACIONES
-- ============================================

-- Índice para obtener reseñas de un profesor
CREATE INDEX IF NOT EXISTS idx_resenas_profesor_id 
ON resenas (profesor_id);

-- Índice compuesto para reseñas ordenadas por fecha
CREATE INDEX IF NOT EXISTS idx_resenas_profesor_fecha 
ON resenas (profesor_id, created_at DESC);

-- Índice para reseñas de un usuario
CREATE INDEX IF NOT EXISTS idx_resenas_usuario_id 
ON resenas (usuario_id);

-- Índice para reseñas por materia
CREATE INDEX IF NOT EXISTS idx_resenas_materia_id 
ON resenas (materia_id);

-- ============================================
-- ÍNDICES PARA CARRERAS Y PERÍODOS
-- ============================================

-- Índice para períodos activos
CREATE INDEX IF NOT EXISTS idx_periodos_activo 
ON periodos (activo);

-- ============================================
-- ACTUALIZAR ESTADÍSTICAS
-- ============================================

-- Ejecutar ANALYZE para actualizar estadísticas del planificador
ANALYZE profesores;
ANALYZE materias;
ANALYZE horarios_materia;
ANALYZE horarios;
ANALYZE horario_materias;
ANALYZE resenas;
ANALYZE carreras;
ANALYZE periodos;

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ejecutar después para confirmar índices creados:
-- SELECT indexname, tablename FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, indexname;
