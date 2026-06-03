import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function BackofficeLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const profile = await prisma.profile.findUnique({ where: { id: user.id } })

  if (!profile || (profile.role !== "EDITOR" && profile.role !== "ADMIN")) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-[#04080f] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0a1628] border-r border-[#1e3a5f] flex flex-col p-4 gap-2">
        <div className="mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Backoffice</p>
          <p className="text-sm font-bold text-amber-400">{profile.role}</p>
        </div>
        <Link href="/backoffice/teams" className="text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
          🏟️ Equipos
        </Link>
        <Link href="/backoffice/matches" className="text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
          ⚽ Partidos
        </Link>
        {profile.role === "ADMIN" && (
          <Link href="/backoffice/users" className="text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
            👥 Usuarios
          </Link>
        )}
        <div className="mt-auto">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Volver al sitio
          </Link>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
