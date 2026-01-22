import type { Metadata } from "next";
import { Lexend, Noto_Sans } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-display",
  subsets: ["latin"],
});

const noto = Noto_Sans({
  variable: "--font-body",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aula Guía | BUAP",
  description: "Eilge a tus profesores con datos reales.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${lexend.variable} ${noto.variable}`}>
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
