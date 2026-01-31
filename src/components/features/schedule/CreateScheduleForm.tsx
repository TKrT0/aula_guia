'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createScheduleSchema, type CreateScheduleInput } from '@/src/lib/validations/schemas'
import { useCreateScheduleMutation } from '@/src/hooks/queries/useScheduleQuery'
import { getCurrentSemester } from '@/src/lib/utils/dateUtils'

interface CreateScheduleFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function CreateScheduleForm({ onSuccess, onCancel }: CreateScheduleFormProps) {
  const createMutation = useCreateScheduleMutation()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateScheduleInput>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: {
      nombre: '',
      semestre: getCurrentSemester(),
    },
  })

  const onSubmit = async (data: CreateScheduleInput) => {
    const result = await createMutation.mutateAsync(data)
    if (result.success) {
      reset()
      onSuccess?.()
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {/* Nombre del horario */}
      <div className="space-y-2">
        <label 
          htmlFor="nombre" 
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Nombre del horario
        </label>
        <input
          id="nombre"
          type="text"
          placeholder="Ej: Mi Horario Primavera 2026"
          {...register('nombre')}
          className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900
            text-slate-800 dark:text-white placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50
            transition-all ${errors.nombre 
              ? 'border-red-500 focus:ring-red-500/50' 
              : 'border-slate-200 dark:border-slate-700'
            }`}
        />
        {errors.nombre && (
          <p className="text-xs text-red-500 mt-1">{errors.nombre.message}</p>
        )}
      </div>

      {/* Semestre */}
      <div className="space-y-2">
        <label 
          htmlFor="semestre" 
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Semestre (opcional)
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            id="semestre"
            type="text"
            placeholder="PA2026 o OI2025"
            {...register('semestre')}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900
              text-slate-800 dark:text-white placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/50
              transition-all ${errors.semestre 
                ? 'border-red-500 focus:ring-red-500/50' 
                : 'border-slate-200 dark:border-slate-700'
              }`}
          />
        </div>
        {errors.semestre && (
          <p className="text-xs text-red-500 mt-1">{errors.semestre.message}</p>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400">
          PA = Primavera, OI = Otoño-Invierno
        </p>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || createMutation.isPending}
          className="flex-1 bg-[#00BCD4] hover:bg-[#00ACC1] text-white"
        >
          {(isSubmitting || createMutation.isPending) ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Creando...
            </>
          ) : (
            'Crear Horario'
          )}
        </Button>
      </div>
    </motion.form>
  )
}
