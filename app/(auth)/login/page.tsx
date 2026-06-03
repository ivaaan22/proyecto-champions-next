"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleLogin() {
    setError("")
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#04080f] flex items-center justify-center px-4">
      <div className="bg-[#0a1628] border border-[#1e3a5f] rounded-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e2/UEFA_Champions_League_logo.png"
            alt="Champions League"
            className="w-14 h-14 object-contain mb-3"
          />
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">
            Futbol <span className="text-blue-400">360</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Inicia sesión en tu cuenta</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-lg cursor-pointer border-none transition-colors mt-1"
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-blue-400 font-semibold hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
