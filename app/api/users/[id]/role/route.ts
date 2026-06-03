import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

type Params = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Solo un ADMIN puede cambiar roles
  const admin = await prisma.profile.findUnique({ where: { id: user.id } })
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const formData = await request.formData()
  const role = formData.get("role") as string

  if (!["USER", "EDITOR", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Rol inválido" }, { status: 400 })
  }

  await prisma.profile.update({
    where: { id },
    data: { role: role as "USER" | "EDITOR" | "ADMIN" },
  })

  return NextResponse.redirect(new URL("/backoffice/users", request.url))
}
