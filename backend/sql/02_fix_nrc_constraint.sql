-- ================================================
-- FIX: Permitir NRCs compartidos entre carreras
-- Las materias de tronco común tienen el mismo NRC
-- pero pertenecen a diferentes carreras
-- ================================================

-- 1. Eliminar constraint único existente en NRC
ALTER TABLE materias DROP CONSTRAINT IF EXISTS materias_nrc_key;

-- 2. Crear nuevo constraint único compuesto (nrc + carrera_id)
-- Esto permite que el mismo NRC exista en diferentes carreras
ALTER TABLE materias ADD CONSTRAINT materias_nrc_carrera_unique UNIQUE (nrc, carrera_id);

-- Verificación: Ejecuta esto después para confirmar
-- SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = 'materias';
