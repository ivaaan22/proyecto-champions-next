import Link from "next/link"

export default function NewTeamPage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-black text-white mb-6">Nuevo equipo</h1>
      <form action="/api/teams" method="POST" className="bg-[#0a1628] border border-[#1e3a5f] rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre</label>
          <input name="name" required placeholder="Real Madrid" className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 transition-colors" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">País</label>
          <input name="country" required placeholder="España" className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 transition-colors" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">URL del escudo</label>
          <input name="crest" required placeholder="https://..." className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 transition-colors" />
        </div>
        <div className="flex gap-3 mt-2">
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg border-none cursor-pointer transition-colors">
            Crear equipo
          </button>
          <Link href="/backoffice/teams" className="bg-transparent border border-[#1e3a5f] text-slate-400 hover:text-white text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
