"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteCommentButton({ id }: { id: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("¿Eliminar este comentario?")) return
    setLoading(true)
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" })
    if (res.ok) {
      router.refresh()
    } else {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-400 hover:text-red-300 bg-transparent border-none cursor-pointer transition-colors shrink-0 disabled:opacity-50"
    >
      {loading ? "..." : "🗑️ Eliminar"}
    </button>
  )
}
