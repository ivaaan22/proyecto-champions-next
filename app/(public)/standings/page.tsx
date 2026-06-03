import { prisma } from "@/lib/prisma"

type TeamData = {
  id: number
  name: string
  crest: string
}

export default async function StandingsPage() {
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } })

  const standings = (teams as TeamData[]).map((team, index) => ({
    pos: index + 1,
    team,
    pj: 8,
    pts: Math.max(0, (22 - index * 0.7) | 0),
    dg: index < 8 ? `+${8 - index}` : index < 24 ? `-${index - 8 + 1}` : `-${index - 15}`,
  }))

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <h2 className="text-2xl font-black text-slate-100 uppercase tracking-widest mb-8">Clasificación</h2>
      <div className="bg-[#060e1e] border border-[#1e3a5f] rounded-2xl p-6">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 uppercase tracking-wider">
              <th className="text-left pb-3 w-6">#</th>
              <th className="text-left pb-3">Equipo</th>
              <th className="text-center pb-3">PJ</th>
              <th className="text-center pb-3">DG</th>
              <th className="text-center pb-3">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.map(s => (
              <tr key={s.pos} className={`border-t border-[#1e3a5f] hover:bg-white/5 transition-colors ${
                s.pos <= 8  ? "border-l-2 border-l-blue-500" :
                s.pos <= 24 ? "border-l-2 border-l-amber-400" :
                "border-l-2 border-l-transparent"
              }`}>
                <td className={`py-2.5 text-xs font-black pl-2 ${
                  s.pos <= 8 ? "text-blue-400" : s.pos <= 24 ? "text-amber-400" : "text-slate-500"
                }`}>{s.pos}</td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <img src={s.team.crest} alt={s.team.name} className="w-5 h-5 object-contain" />
                    <span className="text-sm font-semibold text-slate-100">{s.team.name}</span>
                  </div>
                </td>
                <td className="py-2.5 text-center text-sm text-slate-300">{s.pj}</td>
                <td className="py-2.5 text-center text-sm text-slate-300">{s.dg}</td>
                <td className="py-2.5 text-center text-sm font-black text-slate-100">{s.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-5 pt-4 border-t border-[#1e3a5f] flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-blue-500 shrink-0" />
            <span className="text-xs text-slate-400">Posiciones 1–8: clasificación directa a octavos</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-amber-400 shrink-0" />
            <span className="text-xs text-slate-400">Posiciones 9–24: repechaje</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-slate-700 shrink-0" />
            <span className="text-xs text-slate-400">Posiciones 25–32: eliminados</span>
          </div>
        </div>
      </div>
    </div>
  )
}
