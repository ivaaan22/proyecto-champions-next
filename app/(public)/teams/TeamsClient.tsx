"use client"

import { useState } from "react"
import Link from "next/link"

type Team = {
  id: number
  name: string
  country: string
  crest: string
}

export default function TeamsClient({ teams }: { teams: Team[] }) {
  const [search, setSearch] = useState("")

  const filtered = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.country.toLowerCase().includes(search.toLowerCase())
  )

  const countries = [...new Set(teams.map(t => t.country))].sort()
  const [selectedCountry, setSelectedCountry] = useState("")

  const final = filtered.filter(t =>
    selectedCountry ? t.country === selectedCountry : true
  )

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <h2 className="text-2xl font-black text-slate-100 uppercase tracking-widest mb-6">
        Todos los equipos
      </h2>

      {/* Filtros */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Buscar equipo..."
          className="bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 transition-colors w-64"
        />
        <select
          value={selectedCountry}
          onChange={e => setSelectedCountry(e.target.value)}
          className="bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-4 py-2 text-sm text-slate-100 outline-none focus:border-blue-500 transition-colors cursor-pointer"
        >
          <option value="">🌍 Todos los países</option>
          {countries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {(search || selectedCountry) && (
          <button
            onClick={() => { setSearch(""); setSelectedCountry("") }}
            className="bg-transparent border border-[#1e3a5f] text-slate-400 hover:text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors"
          >
            ✕ Limpiar
          </button>
        )}
        <span className="text-slate-500 text-sm self-center ml-auto">
          {final.length} equipos
        </span>
      </div>

      {/* Grid */}
      {final.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-16">No se encontraron equipos.</p>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {final.map(team => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="bg-[#111827] border border-[#1e293b] rounded-xl p-4 text-center hover:border-blue-500 hover:bg-[#1a2333] transition-all duration-200 hover:-translate-y-1 flex flex-col items-center gap-2"
            >
              <img src={team.crest} alt={team.name} className="w-16 h-16 object-contain" />
              <span className="text-xs font-bold text-slate-100 leading-tight">{team.name}</span>
              <span className="text-xs text-slate-400">{team.country}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
