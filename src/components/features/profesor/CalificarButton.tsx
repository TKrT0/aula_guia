'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMateriasByProfesor } from '@/src/lib/services/professorService';
import ReviewModal from '@/src/components/features/profesor/ReviewModal';

interface Materia {
  materia_id: string;
  materia_nombre: string;
}

interface CalificarButtonProps {
  profesorId: string;
  profesorNombre: string;
  onReviewSubmitted?: () => void;
}

export default function CalificarButton({ 
  profesorId, 
  profesorNombre,
  onReviewSubmitted 
}: CalificarButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loadingMaterias, setLoadingMaterias] = useState(false);

  // Cargar materias cuando se abre el modal
  useEffect(() => {
    if (isModalOpen && materias.length === 0) {
      setLoadingMaterias(true);
      getMateriasByProfesor(profesorId)
        .then(data => setMaterias(data))
        .finally(() => setLoadingMaterias(false));
    }
  }, [isModalOpen, profesorId, materias.length]);

  const handleSuccess = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    router.refresh();
    onReviewSubmitted?.();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5"
      >
        <span className="text-lg">★</span>
        Calificar
      </button>

      <ReviewModal
        profesorId={profesorId}
        profesorNombre={profesorNombre}
        materias={materias}
        loadingMaterias={loadingMaterias}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Toast de éxito */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span className="font-medium">¡Reseña enviada con éxito!</span>
          </div>
        </div>
      )}
    </>
  );
}
