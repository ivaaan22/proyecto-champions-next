import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import CommentSection from "@/components/CommentSection"

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const match = await prisma.match.findUnique({
    where: { id: Number(id) },
    include: {
      homeTeam: true,
      awayTeam: true,
      comments: {
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
    },
  })

  if (!match) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const profile = await prisma.profile.findUnique({ where: { id: user.id } })
    isAdmin = profile?.role === "ADMIN"
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">

      {/* Cabecera del partido */}
      <div className="bg-[#0a1628] border border-[#1e3a5f] rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-slate-400">📅 {match.date}</span>
          <span className="text-slate-600">•</span>
          <span className="text-sm text-blue-400 font-bold uppercase">{match.phase.replace(/_/g, " ")}</span>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-24 h-24 object-contain" />
            <span className="text-lg font-black text-slate-100 text-center">{match.homeTeam.name}</span>
            <span className="text-sm text-slate-400">{match.homeTeam.country}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            {match.status === "done" ? (
              <>
                <span className="text-5xl font-black text-white tracking-widest">
                  {match.homeScore} - {match.awayScore}
                </span>
                <span className="text-sm font-bold text-blue-400">Finalizado</span>
              </>
            ) : (
              <>
                <span className="text-5xl font-black text-amber-400">{match.time}</span>
                <span className="text-sm font-bold text-amber-400">Próximo</span>
              </>
            )}
          </div>
          <div className="flex flex-col items-center gap-3">
            <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-24 h-24 object-contain" />
            <span className="text-lg font-black text-slate-100 text-center">{match.awayTeam.name}</span>
            <span className="text-sm text-slate-400">{match.awayTeam.country}</span>
          </div>
        </div>

        {match.image && (
          <img src={match.image} alt="Imagen del partido" className="w-full max-h-80 object-cover rounded-xl mt-6" />
        )}
      </div>

      {/* Comentarios */}
      <CommentSection
        matchId={match.id}
        comments={match.comments}
        currentUserId={user?.id ?? null}
        isAdmin={isAdmin}
      />

    </div>
  )
}
