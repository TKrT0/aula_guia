'use client'

import { motion } from 'framer-motion'
import { WavyBackground } from '@/components/ui/wavy-background'

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Capa 1 — WavyBackground (Aceternity) */}
      <div className="absolute inset-0">
        <WavyBackground
          colors={[
            "#00E5FF", // Cyan brillante
            "#FF6B6B", // Coral vibrante  
            "#4ECDC4", // Turquesa
            "#45B7D1", // Sky blue
            "#96CEB4", // Sage green
          ]}
          backgroundFill="#0A0F1A"  // Más oscuro para contraste
          blur={6}  // Menos blur para más definición
          speed="fast"  // Más rápido para movimiento visible
          waveOpacity={0.5}  // Más brillante y visible
          waveWidth={40}  // Más delgado para distinguir ondas
          containerClassName="absolute inset-0 h-full"
          className="hidden"
        />
        {/* Overlay para light mode */}
        <div className="absolute inset-0 bg-[#F8FAFC] dark:bg-transparent dark:hidden" />
      </div>

      {/* Capa 2 — Aurora Blobs (animados en desktop) */}
      <div className="absolute inset-0">
        {/* Blob 1 - Cyan (top-left) */}
        <motion.div
          initial={{ x: 0, y: 0 }}
          animate={{ 
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full 
            bg-[rgba(0,188,212,0.15)] dark:bg-[rgba(0,188,212,0.35)]
            blur-[120px]
            motion-reduce:animate-none"
        />
        
        {/* Blob 2 - Blue (top-right) */}
        <motion.div
          initial={{ x: 0, y: 0 }}
          animate={{ 
            x: [0, -40, 20, 0],
            y: [0, 30, -15, 0]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] rounded-full 
            bg-[rgba(43,140,238,0.12)] dark:bg-[rgba(43,140,238,0.30)]
            blur-[150px]
            motion-reduce:animate-none"
        />
        
        {/* Blob 3 - Indigo (bottom-center) */}
        <motion.div
          initial={{ x: 0, y: 0 }}
          animate={{ 
            x: [0, 25, -30, 0],
            y: [0, -25, 20, 0]
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-1/2 left-1/3 w-[450px] h-[450px] rounded-full 
            bg-[rgba(79,70,229,0.08)] dark:bg-[rgba(79,70,229,0.18)]
            blur-[180px]
            motion-reduce:animate-none"
        />
      </div>

      {/* Capa 3 — Spotlight (foco central) */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 60% 50% at 50% 40%,
            rgba(0, 188, 212, 0.10) 0%,
            transparent 70%
          )`
        }}
      />
      <div 
        className="absolute inset-0 dark:block hidden"
        style={{
          background: `radial-gradient(
            ellipse 60% 50% at 50% 40%,
            rgba(0, 188, 212, 0.15) 0%,
            transparent 70%
          )`
        }}
      />

      {/* Capa 4 — Grid sutil */}
      <div 
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      <div 
        className="absolute inset-0 dark:opacity-100 opacity-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Capa 5 — Noise / Grain */}
      <div 
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      />
    </div>
  )
}
