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

// Actualizar equipo
export async function POST(request: NextRequest, { params }: Params) {
  const editor = await requireEditor()
  if (!editor) return NextResponse.redirect(new URL("/login", request.url))

  const { id } = await params
  const formData = await request.formData()
  const action = formData.get("_action") as string

  // Eliminar
  if (action === "delete") {
    // Primero borramos partidos y comentarios relacionados
    await prisma.comment.deleteMany({
      where: { match: { OR: [{ homeId: Number(id) }, { awayId: Number(id) }] } },
    })
    await prisma.match.deleteMany({
      where: { OR: [{ homeId: Number(id) }, { awayId: Number(id) }] },
    })
    await prisma.team.delete({ where: { id: Number(id) } })
    return NextResponse.redirect(new URL("/backoffice/teams", request.url))
  }

  // Actualizar
  const name    = (formData.get("name")    as string)?.trim()
  const country = (formData.get("country") as string)?.trim()
  const crest   = (formData.get("crest")   as string)?.trim()

  if (!name || !country || !crest) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 })
  }

  await prisma.team.update({
    where: { id: Number(id) },
    data: { name, country, crest },
  })

  return NextResponse.redirect(new URL("/backoffice/teams", request.url))
}
