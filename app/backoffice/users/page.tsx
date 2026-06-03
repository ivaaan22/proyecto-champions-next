import { prisma } from "@/lib/prisma"

export default async function BackofficeUsersPage() {
  const profiles = await prisma.profile.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">Usuarios</h1>
      <div className="bg-[#0a1628] border border-[#1e3a5f] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-[#1e3a5f]">
              <th className="text-left px-6 py-3">Usuario</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Rol</th>
              <th className="text-left px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(profile => (
              <tr key={profile.id} className="border-b border-[#1e3a5f] last:border-0 hover:bg-white/5 transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {(profile.username ?? profile.email)[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-slate-100">{profile.username ?? "-"}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-slate-400">{profile.email}</td>
                <td className="px-6 py-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    profile.role === "ADMIN"  ? "bg-red-500/20 text-red-400" :
                    profile.role === "EDITOR" ? "bg-amber-500/20 text-amber-400" :
                    "bg-slate-500/20 text-slate-400"
                  }`}>
                    {profile.role}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <form action={`/api/users/${profile.id}/role`} method="POST" className="flex items-center gap-2">
                    <select name="role" defaultValue={profile.role} className="bg-[#060e1e] border border-[#1e3a5f] text-slate-300 text-xs rounded px-2 py-1 outline-none">
                      <option value="USER">USER</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button type="submit" className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded border-none cursor-pointer transition-colors">
                      Guardar
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
