import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

type Params = { params: Promise<{ id: string }> }

async function requireEditor() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (!profile || (profile.role !== "EDITOR" && profile.role !== "ADMIN")) return null
  return profile
}

export async function POST(request: NextRequest, { params }: Params) {
  const editor = await requireEditor()
  if (!editor) return NextResponse.redirect(new URL("/login", request.url))

  const { id } = await params
  const formData = await request.formData()
  const action = formData.get("_action") as string

  // Eliminar
  if (action === "delete") {
    await prisma.comment.deleteMany({ where: { matchId: Number(id) } })
    await prisma.match.delete({ where: { id: Number(id) } })
    return NextResponse.redirect(new URL("/backoffice/matches", request.url))
  }

  // Actualizar
  const date    = (formData.get("date")   as string)?.trim()
  const phase   = formData.get("phase")    as string
  const homeId  = Number(formData.get("homeId"))
  const awayId  = Number(formData.get("awayId"))
  const status  = formData.get("status")   as string
  const homeScore = formData.get("homeScore") ? Number(formData.get("homeScore")) : null
  const awayScore = formData.get("awayScore") ? Number(formData.get("awayScore")) : null
  const time      = (formData.get("time")  as string)?.trim() || null
  const image     = (formData.get("image") as string)?.trim() || null

  if (!date || !phase || !homeId || !awayId || !status) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 })
  }

  await prisma.match.update({
    where: { id: Number(id) },
    data: {
      date,
      phase: phase as "FASE_DE_GRUPOS" | "CUARTOS" | "SEMIFINAL" | "FINAL",
      homeId,
      awayId,
      status: status as "done" | "upcoming",
      homeScore: status === "done" ? homeScore : null,
      awayScore: status === "done" ? awayScore : null,
      time: status === "upcoming" ? time : null,
      image,
    },
  })

  return NextResponse.redirect(new URL("/backoffice/matches", request.url))
}
