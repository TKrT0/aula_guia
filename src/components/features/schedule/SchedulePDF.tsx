'use client';

import React from 'react';
import {
  Document, Page, Text, View, StyleSheet, pdf, Svg, Path
} from '@react-pdf/renderer';
import type { HorarioMateria } from '@/src/lib/services/scheduleService';

// --- PALETA + getColor (tu misma lógica) ---
const PALETTE = [
  { bg: '#E3F2FD', border: '#2196F3', text: '#1565C0' },
  { bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32' },
  { bg: '#FFEBEE', border: '#EF5350', text: '#C62828' },
  { bg: '#F3E5F5', border: '#AB47BC', text: '#7B1FA2' },
  { bg: '#FFF3E0', border: '#FFA726', text: '#EF6C00' },
  { bg: '#FCE4EC', border: '#EC407A', text: '#AD1457' },
  { bg: '#E0F7FA', border: '#26C6DA', text: '#00838F' },
  { bg: '#FFF8E1', border: '#FFCA28', text: '#FF6F00' },
];

const getColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash % PALETTE.length)];
};

// --- Helpers ---
const strip = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(n => parseInt(n, 10));
  return h * 60 + (m || 0);
};

// Iconitos en SVG (seguro en PDF)
const PersonIcon = ({ color }: { color: string }) => (
  <Svg width={8} height={8} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2 7 4.24 7 7s2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"
    />
  </Svg>
);

const PinIcon = ({ color }: { color: string }) => (
  <Svg width={8} height={8} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
    />
  </Svg>
);

// --- Config “tipo calendario” ---
const DIAS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
const DIAS_N = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

const A4_LANDSCAPE = { w: 841.89, h: 595.28 }; // pt
const CONFIG = {
  margin: 20,
  startHour: 7,
  endHour: 21,          // fin visible (no inclusivo)
  rowHeight: 42,        // ajusta hasta que “se vea igual”
  timeColWidth: 45,
  headerHeight: 28,
  gridLine: '#e7eef6',
  gridLineStrong: '#d9e3ef',
};

const hours = Array.from(
  { length: CONFIG.endHour - CONFIG.startHour },
  (_, i) => CONFIG.startHour + i
);

const styles = StyleSheet.create({
  page: {
    padding: CONFIG.margin,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0b2b3a' },
  subtitle: { fontSize: 9, color: '#64748b' },

  // Tabla “marco”
  table: {
    position: 'relative',
    borderWidth: 1,
    borderColor: CONFIG.gridLineStrong,
  },

  // Header row (días)
  headerRow: { flexDirection: 'row' },
  cornerCell: {
    width: CONFIG.timeColWidth,
    height: CONFIG.headerHeight,
    borderRightWidth: 1,
    borderRightColor: CONFIG.gridLineStrong,
    backgroundColor: '#fff',
  },
  dayHeaderCell: {
    height: CONFIG.headerHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: CONFIG.gridLineStrong,
  },
  dayHeaderText: { fontSize: 9, fontWeight: 'bold', color: '#375569' },

  // Body row: time col + grid area
  bodyRow: { flexDirection: 'row' },
  timeCol: {
    width: CONFIG.timeColWidth,
    borderRightWidth: 1,
    borderRightColor: CONFIG.gridLineStrong,
  },
  timeCell: {
    height: CONFIG.rowHeight,
    borderBottomWidth: 1,
    borderBottomColor: CONFIG.gridLine,
    position: 'relative',
    justifyContent: 'flex-start',
    paddingTop: 0,
    alignItems: 'flex-end',
    paddingRight: 6,
  },
  timeText: {
    fontSize: 8,
    color: '#94a3b8',
    fontWeight: 'bold',
    marginTop: -4,
  },

  gridArea: {
    position: 'relative',
    flexDirection: 'row',
  },
  dayCol: {
    borderRightWidth: 1,
    borderRightColor: CONFIG.gridLineStrong,
  },
  gridRow: {
    height: CONFIG.rowHeight,
    borderBottomWidth: 1,
    borderBottomColor: CONFIG.gridLine,
  },

  // Eventos overlay
  event: {
    position: 'absolute',
    borderRadius: 5,
    padding: 5,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  eventTitle: { fontSize: 7.2, fontWeight: 'bold' },
  eventSmall: { fontSize: 6.2, opacity: 0.9 },

  eventMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 3 },
  footer: { position: 'absolute', bottom: 10, right: 20, fontSize: 8, color: '#cbd5e1' },
});

interface Props {
  scheduleName: string;
  materias: HorarioMateria[];
}

function SchedulePDFDocument({ scheduleName, materias }: Props) {
  const innerW = A4_LANDSCAPE.w - CONFIG.margin * 2;
  const gridW = innerW - CONFIG.timeColWidth;
  const dayW = gridW / DIAS.length;

  const gridH = hours.length * CONFIG.rowHeight; // endHour no inclusivo

  // Render global de eventos con coords absolutas calculadas
  const renderEventsOverlay = () => {
    const nodes: React.ReactNode[] = [];

    materias.forEach((materia, mIdx) => {
      materia.bloques?.forEach((bloque, bIdx) => {
        const dayIndex = DIAS_N.indexOf(strip(bloque.dia));
        if (dayIndex < 0) return;

        const startMin = toMinutes(bloque.hora_inicio);
        const endMin = toMinutes(bloque.hora_fin);

        const minStartVisible = CONFIG.startHour * 60;
        const minEndVisible = CONFIG.endHour * 60;

        // recorte al rango visible
        const s = Math.max(startMin, minStartVisible);
        const e = Math.min(endMin, minEndVisible);
        if (e <= s) return;

        const minutesFromTop = s - minStartVisible;
        const durationMin = e - s;

        const top = (minutesFromTop / 60) * CONFIG.rowHeight + 1;
        const height = (durationMin / 60) * CONFIG.rowHeight - 2;

        const left = dayIndex * dayW + 2;
        const width = dayW - 4;

        const theme = getColor(materia.materia_nombre);

        nodes.push(
          <View
            key={`${mIdx}-${bIdx}`}
            style={[
              styles.event,
              {
                top,
                left,
                width,
                height,
                backgroundColor: theme.bg,
                borderLeftColor: theme.border,
              },
            ]}
          >
            <View style={{ maxHeight: 10, overflow: 'hidden' }}>
              <Text style={[styles.eventTitle, { color: theme.text }]}>
                {materia.materia_nombre}
              </Text>
            </View>

            <Text style={[styles.eventSmall, { color: theme.text }]}>
              {materia.nrc}
            </Text>

            <View style={styles.eventMetaRow}>
              <PersonIcon color={theme.text} />
              <Text style={[styles.eventSmall, { color: theme.text }]}>
                {(materia.profesor_nombre ?? '').split(' ').slice(0, 2).join(' ')}
              </Text>
            </View>

            <View style={styles.eventMetaRow}>
              <PinIcon color={theme.text} />
              <Text style={[styles.eventSmall, { color: theme.text }]}>
                {bloque.salon || 'N/A'}
              </Text>
            </View>
          </View>
        );
      });
    });

    return nodes;
  };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{scheduleName}</Text>
            <Text style={styles.subtitle}>BUAP - Periodo Primavera 2026</Text>
          </View>
          <Text style={styles.subtitle}>Generado por Aula Guía</Text>
        </View>

        {/* Tabla */}
        <View style={[styles.table, { width: innerW }]}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <View style={styles.cornerCell} />
            {DIAS.map((d, i) => (
              <View
                key={d}
                style={[styles.dayHeaderCell, { width: dayW, borderRightWidth: i === DIAS.length - 1 ? 0 : 1 }]}
              >
                <Text style={styles.dayHeaderText}>{d}</Text>
              </View>
            ))}
          </View>
        </View>

          {/* Body */}
          <View style={styles.bodyRow}>
            {/* Time column (UNA sola vez) */}
            <View style={styles.timeCol}>
              {hours.map((h) => (
                <View key={h} style={styles.timeCell}>
                  <Text style={styles.timeText}>{String(h).padStart(2, '0')}:00</Text>
                </View>
              ))}
            </View>

            {/* gridArea SOLO el alto del grid */}
            <View style={[styles.gridArea, { width: gridW, height: gridH }]}>
              {DIAS.map((_, dayIdx) => (
                <View
                  key={dayIdx}
                  style={[
                    styles.dayCol,
                    { width: dayW, borderRightWidth: dayIdx === DIAS.length - 1 ? 0 : 1 },
                  ]}
                >
                  {hours.map((h) => (
                    <View key={h} style={styles.gridRow} />
                  ))}
                </View>
              ))}

              {renderEventsOverlay()}
            </View>
          </View>
        <Text style={styles.footer}>aulaguia.com</Text>
      </Page>
    </Document>
  );
}

export async function generateSchedulePDF(scheduleName: string, materias: HorarioMateria[]) {
  try {
    const blob = await pdf(<SchedulePDFDocument scheduleName={scheduleName} materias={materias} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Horario_${scheduleName.replace(/\s+/g, '_')}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
