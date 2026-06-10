import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import ImageUpload from "@/components/ImageUpload"

type Params = { params: Promise<{ id: string }> }

export default async function EditTeamPage({ params }: Params) {
  const { id } = await params
  const team = await prisma.team.findUnique({ where: { id: Number(id) } })

  if (!team) notFound()

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-black text-white mb-6">Editar equipo</h1>

      <form action={`/api/teams/${team.id}`} method="POST" className="bg-[#0a1628] border border-[#1e3a5f] rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre</label>
          <input name="name" required defaultValue={team.name} className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500 transition-colors" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">País</label>
          <input name="country" required defaultValue={team.country} className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500 transition-colors" />
        </div>

        <ImageUpload name="crest" folder="teams" label="Escudo del equipo" defaultValue={team.crest} />

        <div className="flex gap-3 mt-2">
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg border-none cursor-pointer transition-colors">
            Guardar cambios
          </button>
          <Link href="/backoffice/teams" className="bg-transparent border border-[#1e3a5f] text-slate-400 hover:text-white text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center">
            Cancelar
          </Link>
        </div>
      </form>

      <form action={`/api/teams/${team.id}`} method="POST" className="mt-4">
        <input type="hidden" name="_action" value="delete" />
        <button type="submit" className="text-red-400 hover:text-red-300 text-sm bg-transparent border-none cursor-pointer transition-colors">
          🗑️ Eliminar equipo (y sus partidos)
        </button>
      </form>
    </div>
  )
}
