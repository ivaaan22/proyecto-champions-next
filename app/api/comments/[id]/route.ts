import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

type Params = { params: Promise<{ id: string }> }

// Editar comentario (solo el autor)
export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const comment = await prisma.comment.findUnique({ where: { id: Number(id) } })
  if (!comment) {
    return NextResponse.json({ error: "Comentario no encontrado" }, { status: 404 })
  }

  // Solo el autor puede editar
  if (comment.authorId !== user.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { content } = await request.json()
  if (!content?.trim()) {
    return NextResponse.json({ error: "El comentario no puede estar vacío" }, { status: 400 })
  }

  const updated = await prisma.comment.update({
    where: { id: Number(id) },
    data: { content: content.trim() },
  })

  return NextResponse.json(updated)
}

// Borrar comentario (el autor o un ADMIN)
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const comment = await prisma.comment.findUnique({ where: { id: Number(id) } })
  if (!comment) {
    return NextResponse.json({ error: "Comentario no encontrado" }, { status: 404 })
  }

  // El autor o un ADMIN pueden borrar
  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  const isOwner = comment.authorId === user.id
  const isAdmin = profile?.role === "ADMIN"

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  await prisma.comment.delete({ where: { id: Number(id) } })

  return NextResponse.json({ ok: true })
}
