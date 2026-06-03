import { prisma } from "@/lib/prisma"
import Link from "next/link"

type TeamData = {
  id: number
  name: string
  country: string
  crest: string
}

export default async function BackofficeTeamsPage() {
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Equipos</h1>
        <Link href="/backoffice/teams/new" className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + Nuevo equipo
        </Link>
      </div>
      <div className="bg-[#0a1628] border border-[#1e3a5f] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-[#1e3a5f]">
              <th className="text-left px-6 py-3">Equipo</th>
              <th className="text-left px-6 py-3">País</th>
              <th className="text-left px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(teams as TeamData[]).map((team: TeamData) => (
              <tr key={team.id} className="border-b border-[#1e3a5f] last:border-0 hover:bg-white/5 transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <img src={team.crest} alt={team.name} className="w-8 h-8 object-contain" />
                    <span className="text-sm font-semibold text-slate-100">{team.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-slate-400">{team.country}</td>
                <td className="px-6 py-3">
                  <Link href={`/backoffice/teams/${team.id}/edit`} className="text-blue-400 hover:underline text-sm">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
