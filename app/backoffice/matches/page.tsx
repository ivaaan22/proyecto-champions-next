import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function BackofficeMatchesPage() {
  const matches = await prisma.match.findMany({
    orderBy: { createdAt: "desc" },
    include: { homeTeam: true, awayTeam: true },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Partidos</h1>
        <Link href="/backoffice/matches/new" className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + Nuevo partido
        </Link>
      </div>
      <div className="bg-[#0a1628] border border-[#1e3a5f] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-[#1e3a5f]">
              <th className="text-left px-6 py-3">Partido</th>
              <th className="text-left px-6 py-3">Fase</th>
              <th className="text-left px-6 py-3">Estado</th>
              <th className="text-left px-6 py-3">Resultado</th>
              <th className="text-left px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(match => (
              <tr key={match.id} className="border-b border-[#1e3a5f] last:border-0 hover:bg-white/5 transition-colors">
                <td className="px-6 py-3">
                  <span className="text-sm font-semibold text-slate-100">
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </span>
                  <p className="text-xs text-slate-500">{match.date}</p>
                </td>
                <td className="px-6 py-3 text-sm text-slate-400">{match.phase.replace(/_/g, " ")}</td>
                <td className="px-6 py-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${match.status === "done" ? "bg-blue-500/20 text-blue-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {match.status === "done" ? "Finalizado" : "Próximo"}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-slate-300">
                  {match.status === "done" ? `${match.homeScore} - ${match.awayScore}` : match.time ?? "-"}
                </td>
                <td className="px-6 py-3">
                  <Link href={`/backoffice/matches/${match.id}/edit`} className="text-blue-400 hover:underline text-sm">
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
