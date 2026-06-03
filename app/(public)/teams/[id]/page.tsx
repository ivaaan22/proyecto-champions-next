import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"

type TeamData = {
  id: number
  name: string
  country: string
  crest: string
}

type HomeMatch = {
  id: number
  date: string
  phase: string
  homeScore: number | null
  awayScore: number | null
  time: string | null
  status: string
  createdAt: Date
  awayTeam: TeamData
}

type AwayMatch = {
  id: number
  date: string
  phase: string
  homeScore: number | null
  awayScore: number | null
  time: string | null
  status: string
  createdAt: Date
  homeTeam: TeamData
}

type CombinedMatch = {
  id: number
  date: string
  phase: string
  homeScore: number | null
  awayScore: number | null
  time: string | null
  status: string
  createdAt: Date
  isHome: boolean
  homeTeam?: TeamData
  awayTeam?: TeamData
}

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const team = await prisma.team.findUnique({
    where: { id: Number(id) },
    include: {
      homeMatches: {
        include: { awayTeam: true },
        orderBy: { createdAt: "desc" },
      },
      awayMatches: {
        include: { homeTeam: true },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!team) notFound()

  const homeMatches = team.homeMatches as HomeMatch[]
  const awayMatches = team.awayMatches as AwayMatch[]

  const allMatches: CombinedMatch[] = [
    ...homeMatches.map((m: HomeMatch) => ({ ...m, isHome: true  })),
    ...awayMatches.map((m: AwayMatch) => ({ ...m, isHome: false })),
  ].sort((a: CombinedMatch, b: CombinedMatch) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const wins =
    homeMatches.filter((m: HomeMatch) => m.status === "done" && (m.homeScore ?? 0) > (m.awayScore ?? 0)).length +
    awayMatches.filter((m: AwayMatch) => m.status === "done" && (m.awayScore ?? 0) > (m.homeScore ?? 0)).length
  const draws  = allMatches.filter((m: CombinedMatch) => m.status === "done" && m.homeScore === m.awayScore).length
  const losses = allMatches.filter((m: CombinedMatch) => m.status === "done").length - wins - draws

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">

      {/* Cabecera */}
      <div className="bg-[#0a1628] border border-[#1e3a5f] rounded-2xl p-8 mb-8 flex items-center gap-8">
        <img src={team.crest} alt={team.name} className="w-28 h-28 object-contain" />
        <div>
          <h1 className="text-3xl font-black text-white mb-1">{team.name}</h1>
          <p className="text-slate-400 mb-4">🌍 {team.country}</p>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-black text-green-400">{wins}</p>
              <p className="text-xs text-slate-400">Victorias</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-amber-400">{draws}</p>
              <p className="text-xs text-slate-400">Empates</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-red-400">{losses}</p>
              <p className="text-xs text-slate-400">Derrotas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-100">
                {allMatches.filter((m: CombinedMatch) => m.status === "done").length}
              </p>
              <p className="text-xs text-slate-400">Jugados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Partidos */}
      <h2 className="text-lg font-bold text-slate-100 mb-4">Partidos</h2>
      <div className="flex flex-col gap-3">
        {allMatches.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No hay partidos registrados.</p>
        ) : (
          allMatches.map((match: CombinedMatch) => {
            const opponent = match.isHome ? match.awayTeam : match.homeTeam
            const myScore  = match.isHome ? match.homeScore : match.awayScore
            const oppScore = match.isHome ? match.awayScore : match.homeScore
            const result   = match.status === "done"
              ? (myScore ?? 0) > (oppScore ?? 0) ? "W"
              : (myScore ?? 0) < (oppScore ?? 0) ? "L" : "D"
              : null

            return (
              <Link
                key={match.id}
                href={`/matches/${match.id}`}
                className="bg-[#060e1e] border border-[#1e3a5f] rounded-xl px-5 py-4 flex items-center justify-between hover:border-blue-400 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {opponent && <img src={opponent.crest} alt={opponent.name} className="w-8 h-8 object-contain" />}
                  <div>
                    <p className="text-sm font-semibold text-slate-100">
                      {match.isHome ? "vs" : "@"} {opponent?.name}
                    </p>
                    <p className="text-xs text-slate-500">{match.date} · {match.phase.replace(/_/g, " ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {match.status === "done" ? (
                    <>
                      <span className="text-sm font-black text-white">{myScore} - {oppScore}</span>
                      <span className={`text-xs font-black w-6 h-6 rounded flex items-center justify-center ${
                        result === "W" ? "bg-green-500/20 text-green-400" :
                        result === "L" ? "bg-red-500/20 text-red-400" :
                        "bg-amber-500/20 text-amber-400"
                      }`}>{result}</span>
                    </>
                  ) : (
                    <span className="text-sm font-black text-amber-400">{match.time}</span>
                  )}
                </div>
              </Link>
            )
          })
        )}
      </div>

      <div className="mt-6">
        <Link href="/teams" className="text-sm text-blue-400 hover:underline">← Volver a equipos</Link>
      </div>
    </div>
  )
}
