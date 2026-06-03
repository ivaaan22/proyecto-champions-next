import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

async function requireEditor() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (!profile || (profile.role !== "EDITOR" && profile.role !== "ADMIN")) return null
  return profile
}

export async function POST(request: NextRequest) {
  const editor = await requireEditor()
  if (!editor) return NextResponse.redirect(new URL("/login", request.url))

  const formData = await request.formData()
  const name    = (formData.get("name")    as string)?.trim()
  const country = (formData.get("country") as string)?.trim()
  const crest   = (formData.get("crest")   as string)?.trim()

  if (!name || !country || !crest) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 })
  }

  await prisma.team.create({ data: { name, country, crest } })

  return NextResponse.redirect(new URL("/backoffice/teams", request.url))
}
