"use client"

import { useState } from "react"
import Link from "next/link"

type Team = { id: number; name: string; crest: string }
type Match = {
  id: number
  date: string
  phase: string
  homeTeam: Team
  awayTeam: Team
  homeScore: number | null
  awayScore: number | null
  time: string | null
  status: string
}

const PHASES = [
  { label: "Todos",          value: ""               },
  { label: "Fase de grupos", value: "FASE_DE_GRUPOS" },
  { label: "Cuartos",        value: "CUARTOS"        },
  { label: "Semifinal",      value: "SEMIFINAL"      },
  { label: "Final",          value: "FINAL"          },
]

const STATUS = [
  { label: "Todos",      value: ""         },
  { label: "Finalizados",value: "done"     },
  { label: "Próximos",   value: "upcoming" },
]

export default function MatchesClient({ matches }: { matches: Match[] }) {
  const [phase,  setPhase]  = useState("")
  const [status, setStatus] = useState("")

  const filtered = matches.filter(m =>
    (phase  ? m.phase  === phase  : true) &&
    (status ? m.status === status : true)
  )

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <h2 className="text-2xl font-black text-slate-100 uppercase tracking-widest mb-6">Partidos</h2>

      {/* Filtros fase */}
      <div className="flex gap-2 flex-wrap mb-3">
        {PHASES.map(p => (
          <button
            key={p.value}
            onClick={() => setPhase(p.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border cursor-pointer transition-all duration-200
              ${phase === p.value
                ? "bg-blue-500 border-blue-500 text-white"
                : "bg-transparent border-[#1e3a5f] text-slate-400 hover:border-blue-400 hover:text-slate-100"}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Filtros estado */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS.map(s => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border cursor-pointer transition-all duration-200
              ${status === s.value
                ? "bg-slate-600 border-slate-500 text-white"
                : "bg-transparent border-[#1e3a5f] text-slate-400 hover:border-slate-500 hover:text-slate-100"}`}
          >
            {s.label}
          </button>
        ))}
        <span className="text-slate-500 text-sm self-center ml-auto">{filtered.length} partidos</span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-16">No hay partidos con estos filtros.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(match => (
            <Link
              key={match.id}
              href={`/matches/${match.id}`}
              className="bg-[#0a1628] border border-[#1e3a5f] rounded-xl p-5 hover:border-blue-400 transition-all duration-200 block"
            >
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
                  {match.status === "done" ? (
                    <>
                      <span className="text-3xl font-black text-white">{match.homeScore} - {match.awayScore}</span>
                      <span className="text-xs font-bold text-blue-400">Finalizado</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-black text-amber-400">{match.time}</span>
                      <span className="text-xs font-bold text-amber-400">Próximo</span>
                    </>
                  )}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-12 h-12 object-contain" />
                  <span className="text-sm font-bold text-slate-100 text-center">{match.awayTeam.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
