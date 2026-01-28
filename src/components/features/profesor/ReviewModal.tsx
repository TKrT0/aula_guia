'use client';

import React, { useState } from 'react';
import StarRating from '@/src/components/ui/StarRating';
import { submitReview } from '@/src/lib/services/professorService';

interface Materia {
  materia_id: string;
  materia_nombre: string;
}

interface ReviewModalProps {
  profesorId: string;
  profesorNombre: string;
  materias: Materia[];
  loadingMaterias: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Tags disponibles para seleccionar
const AVAILABLE_TAGS = [
  { id: 'barco', label: 'Barco', emoji: '🚢', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'estricto', label: 'Estricto', emoji: '📏', color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'explica_bien', label: 'Explica bien', emoji: '✨', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'muchas_tareas', label: 'Muchas tareas', emoji: '📚', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'puntual', label: 'Puntual', emoji: '⏰', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'flexible', label: 'Flexible', emoji: '🤝', color: 'bg-teal-100 text-teal-700 border-teal-200' },
];

export default function ReviewModal({ 
  profesorId, 
  profesorNombre,
  materias,
  loadingMaterias,
  isOpen, 
  onClose,
  onSuccess 
}: ReviewModalProps) {
  const [formData, setFormData] = useState({
    puntuacion_general: 0,
    dificultad: 0,
    apoyo: 0,
    puntualidad: 0,
    comentario: '',
    tags: [] as string[],
    materia_id: null as string | null,
    materia_nombre: null as string | null,
    semestre: '' as string,
    modos_evaluacion: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (formData.puntuacion_general === 0) {
      setError('Por favor, selecciona una puntuación general.');
      return;
    }

    // Validación de comentario mínimo
    const MIN_COMENTARIO_LENGTH = 20;
    if (formData.comentario.trim().length < MIN_COMENTARIO_LENGTH) {
      setError(`El comentario debe tener al menos ${MIN_COMENTARIO_LENGTH} caracteres.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitReview(profesorId, formData);
      
      if (result.success) {
        setFormData({
          puntuacion_general: 0,
          dificultad: 0,
          apoyo: 0,
          puntualidad: 0,
          comentario: '',
          tags: [],
          materia_id: null,
          materia_nombre: null,
          semestre: '',
          modos_evaluacion: []
        });
        onSuccess();
        onClose();
      } else {
        setError(result.error || 'Error al enviar la reseña');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Calificar Profesor
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {profesorNombre}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Puntuación General */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
            <StarRating
              label="Puntuación General *"
              value={formData.puntuacion_general}
              onChange={(v) => setFormData({...formData, puntuacion_general: v})}
              size="lg"
            />
          </div>

          {/* Selector de Materia */}
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-2">
              ¿Qué materia cursaste?
            </label>
            {loadingMaterias ? (
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-slate-400 text-sm">
                Cargando materias...
              </div>
            ) : materias.length > 0 ? (
              <select
                value={formData.materia_id || ''}
                onChange={(e) => {
                  const selected = materias.find(m => m.materia_id === e.target.value);
                  setFormData({
                    ...formData,
                    materia_id: selected?.materia_id || null,
                    materia_nombre: selected?.materia_nombre || null
                  });
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              >
                <option value="">Selecciona una materia (opcional)</option>
                {materias.map((m) => (
                  <option key={m.materia_id} value={m.materia_id}>
                    {m.materia_nombre}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-slate-400 text-sm">
                No hay materias registradas para este profesor
              </div>
            )}
          </div>

          {/* Grid de métricas secundarias */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <StarRating
                label="Dificultad"
                value={formData.dificultad}
                onChange={(v) => setFormData({...formData, dificultad: v})}
                size="sm"
              />
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <StarRating
                label="Apoyo"
                value={formData.apoyo}
                onChange={(v) => setFormData({...formData, apoyo: v})}
                size="sm"
              />
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <StarRating
                label="Puntualidad"
                value={formData.puntualidad}
                onChange={(v) => setFormData({...formData, puntualidad: v})}
                size="sm"
              />
            </div>
          </div>

          {/* Semestre y Modos de Evaluación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Selector de Semestre */}
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-2">
                ¿Cuándo la cursaste?
              </label>
              <select
                value={formData.semestre}
                onChange={(e) => setFormData({...formData, semestre: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
              >
                <option value="">Selecciona (opcional)</option>
                <option value="P2025">Primavera 2025</option>
                <option value="O2024">Otoño 2024</option>
                <option value="P2024">Primavera 2024</option>
                <option value="O2023">Otoño 2023</option>
                <option value="Anterior">Anterior a 2023</option>
              </select>
            </div>

            {/* Modos de Evaluación */}
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-2">
                ¿Cómo evalúa?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'examenes', label: '📝 Exámenes' },
                  { id: 'proyectos', label: '💻 Proyectos' },
                  { id: 'tareas', label: '📋 Tareas' },
                  { id: 'participacion', label: '🙋 Participación' }
                ].map((modo) => {
                  const isSelected = formData.modos_evaluacion.includes(modo.id);
                  return (
                    <button
                      key={modo.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setFormData({...formData, modos_evaluacion: formData.modos_evaluacion.filter(m => m !== modo.id)});
                        } else {
                          setFormData({...formData, modos_evaluacion: [...formData.modos_evaluacion, modo.id]});
                        }
                      }}
                      className={`px-2 py-1 rounded-lg text-xs font-medium border transition-all ${
                        isSelected 
                          ? 'bg-primary/10 text-primary border-primary' 
                          : 'bg-slate-100 text-slate-500 border-transparent dark:bg-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {modo.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tags/Etiquetas */}
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-3">
              Etiquetas (opcional)
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = formData.tags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setFormData({...formData, tags: formData.tags.filter(t => t !== tag.id)});
                      } else {
                        setFormData({...formData, tags: [...formData.tags, tag.id]});
                      }
                    }}
                    className={`
                      px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all
                      ${isSelected 
                        ? `${tag.color} border-current scale-105` 
                        : 'bg-slate-100 text-slate-500 border-transparent hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400'
                      }
                    `}
                  >
                    {tag.emoji} {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comentario */}
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-2">
              Comentario *
            </label>
            <textarea
              value={formData.comentario}
              onChange={(e) => setFormData({...formData, comentario: e.target.value})}
              placeholder="Comparte tu experiencia con este profesor (mínimo 20 caracteres)..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
            />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${formData.comentario.trim().length >= 20 ? 'text-green-500' : 'text-slate-400'}`}>
                {formData.comentario.trim().length}/20 caracteres mínimo
              </span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Nota de anonimato */}
          <p className="text-xs text-slate-400 text-center">
            🔒 Tu reseña será completamente anónima
          </p>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
