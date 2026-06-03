import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"

type Params = { params: Promise<{ id: string }> }
type TeamOption = { id: number; name: string }

export default async function EditMatchPage({ params }: Params) {
  const { id } = await params

  const [match, teams] = await Promise.all([
    prisma.match.findUnique({ where: { id: Number(id) } }),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
  ])

  if (!match) notFound()
  const teamOptions = teams as TeamOption[]

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-black text-white mb-6">Editar partido</h1>

      <form action={`/api/matches/${match.id}`} method="POST" className="bg-[#0a1628] border border-[#1e3a5f] rounded-2xl p-6 flex flex-col gap-4">

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fecha</label>
          <input name="date" required defaultValue={match.date} className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500 transition-colors" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fase</label>
          <select name="phase" required defaultValue={match.phase} className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500 transition-colors">
            <option value="FASE_DE_GRUPOS">Fase de grupos</option>
            <option value="CUARTOS">Cuartos</option>
            <option value="SEMIFINAL">Semifinal</option>
            <option value="FINAL">Final</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Local</label>
            <select name="homeId" required defaultValue={match.homeId} className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500 transition-colors">
              {teamOptions.map((t: TeamOption) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Visitante</label>
            <select name="awayId" required defaultValue={match.awayId} className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500 transition-colors">
              {teamOptions.map((t: TeamOption) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</label>
          <select name="status" required defaultValue={match.status} className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500 transition-colors">
            <option value="done">Finalizado</option>
            <option value="upcoming">Próximo</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Goles local</label>
            <input name="homeScore" type="number" min="0" defaultValue={match.homeScore ?? ""} className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Goles visitante</label>
            <input name="awayScore" type="number" min="0" defaultValue={match.awayScore ?? ""} className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500 transition-colors" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hora (si es próximo)</label>
          <input name="time" defaultValue={match.time ?? ""} placeholder="21:00" className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 transition-colors" />
        </div>

        <div className="flex gap-3 mt-2">
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg border-none cursor-pointer transition-colors">
            Guardar cambios
          </button>
          <Link href="/backoffice/matches" className="bg-transparent border border-[#1e3a5f] text-slate-400 hover:text-white text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center">
            Cancelar
          </Link>
        </div>
      </form>

      {/* Eliminar */}
      <form action={`/api/matches/${match.id}`} method="POST" className="mt-4">
        <input type="hidden" name="_action" value="delete" />
        <button type="submit" className="text-red-400 hover:text-red-300 text-sm bg-transparent border-none cursor-pointer transition-colors">
          🗑️ Eliminar partido
        </button>
      </form>
    </div>
  )
}
