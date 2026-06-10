import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function BackofficeHomePage() {
  const [teamsCount, matchesCount, usersCount, commentsCount] = await Promise.all([
    prisma.team.count(),
    prisma.match.count(),
    prisma.profile.count(),
    prisma.comment.count(),
  ])

  const stats = [
    { label: "Equipos",     value: teamsCount,    icon: "🏟️", href: "/backoffice/teams"    },
    { label: "Partidos",    value: matchesCount,  icon: "⚽", href: "/backoffice/matches"  },
    { label: "Usuarios",    value: usersCount,    icon: "👥", href: "/backoffice/users"    },
    { label: "Comentarios", value: commentsCount, icon: "💬", href: "/backoffice/comments" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">Panel de control</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-[#0a1628] border border-[#1e3a5f] rounded-2xl p-6 hover:border-blue-400 transition-colors"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-3xl font-black text-white">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
