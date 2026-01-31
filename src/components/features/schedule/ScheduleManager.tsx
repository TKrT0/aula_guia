'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Trash2, Plus, Loader2, Clock } from 'lucide-react';
import { Horario, deleteSchedule } from '@/src/lib/services/scheduleService';
import { useDeleteScheduleMutation } from '@/src/hooks/queries/useScheduleQuery';
import { formatRelativeTime, formatSemester } from '@/src/lib/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CreateScheduleForm from './CreateScheduleForm';

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
  const deleteMutation = useDeleteScheduleMutation();

  if (!isOpen) return null;

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar el horario "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    const result = await deleteMutation.mutateAsync(id);
    if (result.success) {
      onScheduleDeleted(id);
    }
  };

  const handleScheduleCreated = (schedule: Horario) => {
    onScheduleCreated(schedule);
    setIsCreating(false);
  };

  return (
    <AnimatePresence>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden border"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">Mis Horarios</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {/* Lista de horarios */}
          {schedules.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <Calendar className="size-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No tienes horarios aún</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {schedules.map((schedule, idx) => (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card
                    className={`
                      flex items-center justify-between p-3 cursor-pointer transition-all
                      ${schedule.id === activeScheduleId
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'hover:border-primary/50'
                      }
                    `}
                    onClick={() => {
                      onSelectSchedule(schedule.id);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${schedule.id === activeScheduleId ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                      <div>
                        <p className="font-semibold text-sm">{schedule.nombre}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {schedule.total_creditos} cr
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatSemester(schedule.semestre || '')}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground/70 flex items-center gap-1 mt-1">
                          <Clock className="size-3" />
                          {formatRelativeTime(schedule.updated_at || schedule.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(schedule.id, schedule.nombre);
                      }}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Crear nuevo */}
          <AnimatePresence mode="wait">
          {isCreating ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-muted/50 rounded-xl"
            >
              <CreateScheduleForm
                onSuccess={() => setIsCreating(false)}
                onCancel={() => setIsCreating(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                variant="outline"
                onClick={() => setIsCreating(true)}
                className="mt-4 w-full border-dashed"
              >
                <Plus className="size-4 mr-2" />
                Crear nuevo horario
              </Button>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
    </AnimatePresence>
  );
}
