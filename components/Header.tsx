"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/types"

export default function Header() {
  const [user, setUser]           = useState<Profile | null>(null)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router   = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const navLinks = [
    { label: "Inicio",        href: "/"            },
    { label: "Equipos",       href: "/teams"       },
    { label: "Partidos",      href: "/matches"     },
    { label: "Clasificación", href: "/standings"   },
  ]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id:        session.user.id,
          email:     session.user.email ?? "",
          username:  session.user.user_metadata?.username ?? null,
          avatarUrl: session.user.user_metadata?.avatar_url ?? null,
          role:      session.user.user_metadata?.role ?? "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setUser({
          id:        session.user.id,
          email:     session.user.email ?? "",
          username:  session.user.user_metadata?.username ?? null,
          avatarUrl: session.user.user_metadata?.avatar_url ?? null,
          role:      session.user.user_metadata?.role ?? "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest("#user-menu")) setUserMenuOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
    router.refresh()
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    const path = `${user.id}/avatar`
    await supabase.storage.from("avatars").remove([path])
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { contentType: file.type, cacheControl: "0", upsert: true })
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path)
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
      setUser(prev => prev ? { ...prev, avatarUrl: publicUrl } : null)
    }
    setUserMenuOpen(false)
    setUploading(false)
  }

  return (
    <header className="bg-[#1a3a5c] border-b border-[#2a5080] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center gap-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e2/UEFA_Champions_League_logo.png"
            alt="Champions League"
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold text-white tracking-wide">
            FUTBOL <span className="text-blue-300">360</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center flex-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative h-16 flex items-center px-4 text-sm font-medium transition-colors
                ${pathname === link.href ? "text-white" : "text-blue-100 hover:text-white"}`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-300" />
              )}
            </Link>
          ))}
          {user?.role === "ADMIN" && (
            <Link
              href="/backoffice"
              className={`relative h-16 flex items-center px-4 text-sm font-medium transition-colors
                ${pathname.startsWith("/backoffice") ? "text-amber-300" : "text-amber-400/70 hover:text-amber-300"}`}
            >
              ⚙️ Backoffice
              {pathname.startsWith("/backoffice") && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-300" />
              )}
            </Link>
          )}
          {user?.role === "EDITOR" && (
            <Link
              href="/backoffice/teams"
              className="relative h-16 flex items-center px-4 text-sm font-medium text-amber-400/70 hover:text-amber-300 transition-colors"
            >
              ✏️ Editor
            </Link>
          )}
        </nav>

        {/* Derecha */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div id="user-menu" className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-transparent border-none cursor-pointer"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover border-2 border-blue-300" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold border-2 border-blue-300">
                    {(user.username ?? user.email)[0].toUpperCase()}
                  </div>
                )}
                <span className="text-blue-100 text-sm font-medium">
                  {user.username ?? user.email.split("@")[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-12 bg-[#0a1628] border border-[#1e3a5f] rounded-xl shadow-xl w-52 py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#1e3a5f] mb-1">
                    <p className="text-xs text-slate-400">Conectado como</p>
                    <p className="text-sm font-semibold text-slate-100 truncate">{user.email}</p>
                    <span className="text-xs font-bold text-blue-400">{user.role}</span>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 bg-transparent border-none cursor-pointer transition-colors"
                  >
                    {uploading ? "⏳ Subiendo..." : "📷 Cambiar foto"}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 bg-transparent border-none cursor-pointer transition-colors"
                  >
                    🚪 Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-blue-100 hover:text-white text-sm font-medium transition-colors">
                Iniciar sesión
              </Link>
              <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors">
                Registrarse
              </Link>
            </div>
          )}
        </div>

        {/* Hamburguesa */}
        <button
          className="md:hidden ml-auto bg-transparent border-none text-white text-xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden flex flex-col bg-[#1a3a5c] border-t border-[#2a5080]">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-8 py-3 text-sm font-medium transition-colors
                ${pathname === link.href ? "text-white bg-[#24507a]" : "text-blue-100 hover:text-white"}`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="bg-transparent border-none text-left px-8 py-3 text-sm font-medium cursor-pointer text-red-400">
              🚪 Cerrar sesión
            </button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="px-8 py-3 text-sm font-medium text-blue-300">
              Iniciar sesión
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
