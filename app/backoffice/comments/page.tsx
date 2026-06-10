import { prisma } from "@/lib/prisma"
import Link from "next/link"
import DeleteCommentButton from "./DeleteCommentButton"

type CommentRow = {
  id: number
  content: string
  createdAt: Date
  author: {
    username: string | null
    email: string
    avatarUrl: string | null
  }
  match: {
    id: number
    date: string
    homeTeam: { name: string }
    awayTeam: { name: string }
  }
}

export default async function BackofficeCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      match: {
        include: { homeTeam: true, awayTeam: true },
      },
    },
  })

  const rows = comments as CommentRow[]

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">Comentarios ({rows.length})</h1>

      {rows.length === 0 ? (
        <p className="text-slate-500 text-sm">No hay comentarios todavía.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((c: CommentRow) => (
            <div key={c.id} className="bg-[#0a1628] border border-[#1e3a5f] rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3 flex-1">
                  {/* Autor */}
                  {c.author.avatarUrl ? (
                    <img src={c.author.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {(c.author.username ?? c.author.email)[0].toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1">
                    {/* Quién y cuándo */}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold text-slate-100">
                        {c.author.username ?? c.author.email.split("@")[0]}
                      </span>
                      <span className="text-xs text-slate-500">{c.author.email}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString("es-ES", {
                          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                    </div>

                    {/* En qué partido */}
                    <Link
                      href={`/matches/${c.match.id}`}
                      className="inline-block text-xs text-blue-400 hover:underline mb-2"
                    >
                      ⚽ {c.match.homeTeam.name} vs {c.match.awayTeam.name} · {c.match.date}
                    </Link>

                    {/* Qué ha comentado */}
                    <p className="text-sm text-slate-300">{c.content}</p>
                  </div>
                </div>

                {/* Eliminar */}
                <DeleteCommentButton id={c.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
