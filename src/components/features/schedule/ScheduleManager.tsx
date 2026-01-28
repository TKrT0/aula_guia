'use client';

import { useState } from 'react';
import { Horario, createSchedule, deleteSchedule } from '@/src/lib/services/scheduleService';
import { useToast } from '@/src/contexts/ToastContext';

interface ScheduleManagerProps {
  schedules: Horario[];
  activeScheduleId: string | null;
  onSelectSchedule: (id: string) => void;
  onScheduleCreated: (schedule: Horario) => void;
  onScheduleDeleted: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleManager({
  schedules,
  activeScheduleId,
  onSelectSchedule,
  onScheduleCreated,
  onScheduleDeleted,
  isOpen,
  onClose,
}: ScheduleManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!newName.trim()) {
      error('Ingresa un nombre para el horario');
      return;
    }

    setLoading(true);
    const result = await createSchedule(newName.trim());
    setLoading(false);

    if (result.success && result.data) {
      success('Horario creado exitosamente');
      onScheduleCreated(result.data);
      setNewName('');
      setIsCreating(false);
    } else {
      error(result.error || 'Error al crear horario');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar el horario "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setLoading(true);
    const result = await deleteSchedule(id);
    setLoading(false);

    if (result.success) {
      success('Horario eliminado');
      onScheduleDeleted(id);
    } else {
      error(result.error || 'Error al eliminar horario');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Mis Horarios</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {/* Lista de horarios */}
          {schedules.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">calendar_month</span>
              <p className="text-slate-500 dark:text-slate-400 mt-2">No tienes horarios aún</p>
            </div>
          ) : (
            <div className="space-y-2">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className={`
                    flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer
                    ${schedule.id === activeScheduleId
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
                    }
                  `}
                  onClick={() => {
                    onSelectSchedule(schedule.id);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${schedule.id === activeScheduleId ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`} />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">{schedule.nombre}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {schedule.total_creditos} créditos • {schedule.semestre || 'Sin semestre'}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(schedule.id, schedule.nombre);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    disabled={loading}
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Crear nuevo */}
          {isCreating ? (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre del horario..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Crear'}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewName('');
                  }}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
              <span className="font-semibold text-sm">Crear nuevo horario</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
