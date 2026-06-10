"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Props = {
  name: string              // nombre del input hidden que se envía en el form
  defaultValue?: string     // URL actual (en edición)
  folder: string            // carpeta dentro del bucket: "teams" o "matches"
  label?: string
}

export default function ImageUpload({ name, defaultValue = "", folder, label = "Imagen" }: Props) {
  const [url, setUrl]           = useState(defaultValue)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState("")
  const supabase = createClient()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")

    const ext  = file.name.split(".").pop()
    const path = `${folder}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(path, file, { contentType: file.type, cacheControl: "3600", upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from("images").getPublicUrl(path)
    setUrl(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>

      {/* URL real que se envía en el formulario */}
      <input type="hidden" name={name} value={url} />

      <div className="flex items-center gap-3">
        {url ? (
          <img src={url} alt="preview" className="w-14 h-14 object-contain bg-[#060e1e] border border-[#1e3a5f] rounded-lg p-1" />
        ) : (
          <div className="w-14 h-14 bg-[#060e1e] border border-dashed border-[#1e3a5f] rounded-lg flex items-center justify-center text-slate-600 text-xs">
            Sin img
          </div>
        )}
        <label className="bg-[#060e1e] border border-[#1e3a5f] text-slate-300 hover:text-white hover:border-blue-500 text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors">
          {uploading ? "⏳ Subiendo..." : "📷 Subir imagen"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {/* También permitimos pegar una URL manualmente */}
      <input
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="o pega una URL..."
        className="bg-[#060e1e] border border-[#1e3a5f] rounded-lg px-4 py-2 text-xs text-slate-400 placeholder-slate-600 outline-none focus:border-blue-500 transition-colors"
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
