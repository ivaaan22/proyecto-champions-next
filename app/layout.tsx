import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Futbol 360 — Champions SaaS",
  description: "Plataforma de equipos, partidos y clasificación de la Champions League",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col bg-[#04080f] antialiased">
        {children}
      </body>
    </html>
  )
}
