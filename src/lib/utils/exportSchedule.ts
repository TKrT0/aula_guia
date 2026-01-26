import * as htmlToImage from 'html-to-image';
import { createEvents, DateArray, EventAttributes } from 'ics';

/**
 * Exporta un elemento HTML como imagen PNG usando html-to-image
 */
export async function exportAsImage(elementId: string, filename = 'horario'): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Elemento no encontrado:', elementId);
    return false;
  }

  try {
    // Ocultar iconos de Material Symbols antes de capturar
    const icons = element.querySelectorAll('.material-symbols-outlined');
    icons.forEach(icon => {
      (icon as HTMLElement).style.visibility = 'hidden';
    });

    // Filtrar elementos problemáticos
    const filter = (node: HTMLElement) => {
      if (node.tagName === 'LINK') {
        const href = (node as HTMLLinkElement).href || '';
        if (href.includes('fonts.googleapis.com')) return false;
      }
      if (node.classList?.contains('material-symbols-outlined')) {
        return false;
      }
      return true;
    };

    const dataUrl = await htmlToImage.toPng(element, {
      quality: 1,
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      skipFonts: true,
      filter,
      style: {
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
    });

    // Restaurar iconos
    icons.forEach(icon => {
      (icon as HTMLElement).style.visibility = '';
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
    
    return true;
  } catch (error) {
    console.error('Error al exportar imagen:', error);
    return false;
  }
}

/**
 * Tipo para los bloques de horario
 */
interface HorarioBloque {
  materia_nombre: string;
  profesor_nombre: string;
  dia: string;
  hora_inicio: string;
  hora_fin: string;
  salon?: string | null;
  nrc?: string;
}

/**
 * Genera un archivo ICS (calendario) desde los bloques de horario
 */
export async function exportToCalendar(
  bloques: HorarioBloque[],
  nombreHorario: string = 'Mi Horario'
): Promise<boolean> {
  if (!bloques || bloques.length === 0) {
    console.error('No hay bloques de horario para exportar');
    return false;
  }

  try {
    const diaMap: Record<string, number> = {
      'lunes': 1, 'martes': 2, 'miercoles': 3, 'miércoles': 3,
      'jueves': 4, 'viernes': 5, 'sabado': 6, 'sábado': 6, 'domingo': 0
    };

    const getNextDate = (dia: string): Date => {
      const today = new Date();
      const targetDay = diaMap[dia.toLowerCase()] || 1;
      const currentDay = today.getDay();
      const daysUntil = (targetDay - currentDay + 7) % 7 || 7;
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysUntil);
      return nextDate;
    };

    const parseTime = (hora: string): [number, number] => {
      const [h, m] = hora.split(':').map(Number);
      return [h, m || 0];
    };

    const events: EventAttributes[] = bloques.map((bloque) => {
      const fecha = getNextDate(bloque.dia);
      const [startH, startM] = parseTime(bloque.hora_inicio);
      const [endH, endM] = parseTime(bloque.hora_fin);

      const start: DateArray = [
        fecha.getFullYear(),
        fecha.getMonth() + 1,
        fecha.getDate(),
        startH,
        startM
      ];

      const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
      const durationHours = Math.floor(durationMinutes / 60);
      const durationMins = durationMinutes % 60;

      return {
        title: bloque.materia_nombre,
        description: `Profesor: ${bloque.profesor_nombre}${bloque.nrc ? `\nNRC: ${bloque.nrc}` : ''}`,
        location: bloque.salon || undefined,
        start,
        duration: { hours: durationHours, minutes: durationMins },
        recurrenceRule: 'FREQ=WEEKLY;COUNT=16',
      };
    });

    const { error, value } = createEvents(events);
    
    if (error) {
      console.error('Error al crear eventos:', error);
      return false;
    }

    const blob = new Blob([value || ''], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${nombreHorario.replace(/\s+/g, '_')}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);

    return true;
  } catch (error) {
    console.error('Error al exportar calendario:', error);
    return false;
  }
}
