import { prisma } from "@/lib/prisma"
import Link from "next/link"
import type { Prisma } from "@prisma/client"

type TeamData = Prisma.TeamGetPayload<object>
type MatchWithTeams = Prisma.MatchGetPayload<{
  include: { homeTeam: true; awayTeam: true }
}>

export default async function HomePage() {
  const [teams, matches] = await Promise.all([
    prisma.team.findMany({ take: 8, orderBy: { name: "asc" } }),
    prisma.match.findMany({
      where: { status: "done" },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { homeTeam: true, awayTeam: true },
    }),
  ])

  return (
    <div>
      {/* Hero */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "500px",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#04080f] via-[#04080fcc] to-[#04080f80]" />
        <div className="relative z-10 max-w-6xl mx-auto w-full px-8 py-16">
          <h1 className="font-black text-5xl md:text-6xl uppercase leading-none tracking-widest text-slate-100 mb-4">
            Equipos y<br />
            <span className="text-blue-500">resultados</span>
          </h1>
          <p className="text-slate-400 text-sm mb-6 max-w-sm">
            Sigue los últimos partidos y resultados de la Champions League.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/matches" className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors">
              📅 Ver partidos
            </Link>
            <Link href="/standings" className="bg-transparent hover:bg-white/5 text-slate-100 text-sm font-semibold px-5 py-2.5 rounded-md border border-white/30 transition-colors">
              📊 Ver clasificación
            </Link>
          </div>
        </div>
      </section>

      {/* Equipos destacados */}
      <section className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-100">Equipos destacados</h2>
          <Link href="/teams" className="text-sm text-blue-500 font-medium hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {teams.map((team: TeamData) => (
            <Link key={team.id} href={`/teams/${team.id}`} className="bg-[#111827] border border-[#1e293b] rounded-xl p-4 text-center hover:border-blue-500 hover:bg-[#1a2333] transition-all duration-200 hover:-translate-y-1 flex flex-col items-center gap-2">
              <img src={team.crest} alt={team.name} className="w-12 h-12 object-contain" />
              <span className="text-xs font-bold text-slate-100">{team.name}</span>
              <span className="text-xs text-slate-400">{team.country}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Últimos resultados */}
      <section className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-100">Últimos resultados</h2>
          <Link href="/matches" className="text-sm text-blue-400 font-medium hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {matches.map((match: MatchWithTeams) => (
            <Link key={match.id} href={`/matches/${match.id}`} className="bg-[#0a1628] border border-[#1e3a5f] rounded-xl p-5 hover:border-blue-400 transition-all duration-200 block">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-slate-400">📅 {match.date}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 font-semibold uppercase">{match.phase.replace(/_/g, " ")}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <div className="flex flex-col items-center gap-2">
                  <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-12 h-12 object-contain" />
                  <span className="text-sm font-bold text-slate-100 text-center">{match.homeTeam.name}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-black text-white tracking-widest">
                    {match.homeScore} - {match.awayScore}
                  </span>
                  <span className="text-xs font-bold text-blue-400">Finalizado</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-12 h-12 object-contain" />
                  <span className="text-sm font-bold text-slate-100 text-center">{match.awayTeam.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
