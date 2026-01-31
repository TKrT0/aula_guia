import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aula Guía | BUAP - Elige tus profesores con datos reales",
  description: "Plataforma para estudiantes de la BUAP. Consulta horarios, calificaciones de profesores y arma tu horario ideal. Encuentra el mejor profesor para cada materia.",
  keywords: ["BUAP", "profesores", "horarios", "materias", "FCC", "universidad", "calificaciones"],
  authors: [{ name: "Aula Guía" }],
  openGraph: {
    title: "Aula Guía | BUAP",
    description: "Elige tus profesores con datos reales. Consulta horarios y arma tu horario ideal.",
    type: "website",
    locale: "es_MX",
    siteName: "Aula Guía",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aula Guía | BUAP",
    description: "Elige tus profesores con datos reales. Consulta horarios y arma tu horario ideal.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${sora.variable} ${inter.variable} dark`}>
      <head>
        {/* Favicons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#003A5C" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Aula Guía" />
        
        {/* Material Icons */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

