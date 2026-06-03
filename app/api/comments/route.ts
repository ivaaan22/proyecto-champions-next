import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { matchId, content } = await request.json()

  if (!content?.trim()) {
    return NextResponse.json({ error: "El comentario no puede estar vacío" }, { status: 400 })
  }

  // Aseguramos que el perfil existe
  await prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email ?? "",
      username: user.user_metadata?.username ?? null,
      avatarUrl: user.user_metadata?.avatar_url ?? null,
      role: "USER",
    },
  })

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      matchId: Number(matchId),
      authorId: user.id,
    },
  })

  return NextResponse.json(comment, { status: 201 })
}
