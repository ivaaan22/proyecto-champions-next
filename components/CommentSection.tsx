"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Comment = {
  id: number
  content: string
  createdAt: Date
  authorId: string
  author: {
    username: string | null
    email: string
    avatarUrl: string | null
  }
}

type Props = {
  matchId: number
  comments: Comment[]
  currentUserId: string | null
  isAdmin?: boolean
}

export default function CommentSection({ matchId, comments, currentUserId, isAdmin = false }: Props) {
  const [content, setContent]   = useState("")
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const router = useRouter()

  async function handleSubmit() {
    if (!content.trim()) return
    setLoading(true)
    setError("")

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, content }),
    })

    if (res.ok) {
      setContent("")
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? "Error al publicar el comentario")
    }
    setLoading(false)
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este comentario?")) return
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" })
    if (res.ok) router.refresh()
  }

  async function handleEditSave(id: number) {
    if (!editContent.trim()) return
    const res = await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent }),
    })
    if (res.ok) {
      setEditingId(null)
      router.refresh()
    }
  }

  function startEdit(comment: Comment) {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  return (
    <div className="bg-[#060e1e] border border-[#1e3a5f] rounded-2xl p-6">
      <h3 className="text-base font-bold text-slate-100 mb-6">
        💬 Comentarios ({comments.length})
      </h3>

      {/* Formulario nuevo comentario */}
      {currentUserId ? (
        <div className="mb-6">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Escribe tu comentario..."
            rows={3}
            className="w-full bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 transition-colors resize-none"
          />
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            className="mt-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg border-none cursor-pointer transition-colors"
          >
            {loading ? "Publicando..." : "Publicar comentario"}
          </button>
        </div>
      ) : (
        <div className="mb-6 bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-4 py-3">
          <p className="text-sm text-slate-400">
            <a href="/login" className="text-blue-400 hover:underline font-semibold">Inicia sesión</a> para dejar un comentario.
          </p>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="flex flex-col gap-4">
        {comments.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-6">No hay comentarios aún. ¡Sé el primero!</p>
        ) : (
          comments.map(comment => {
            const isOwner = currentUserId === comment.authorId
            const canEdit = isOwner
            const canDelete = isOwner || isAdmin

            return (
              <div key={comment.id} className="flex gap-3">
                {comment.author.avatarUrl ? (
                  <img src={comment.author.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(comment.author.username ?? comment.author.email)[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-100">
                      {comment.author.username ?? comment.author.email.split("@")[0]}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(comment.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </span>
                  </div>

                  {editingId === comment.id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        rows={2}
                        className="w-full bg-[#0a1628] border border-[#1e3a5f] rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleEditSave(comment.id)} className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded border-none cursor-pointer transition-colors">
                          Guardar
                        </button>
                        <button onClick={() => setEditingId(null)} className="bg-transparent border border-[#1e3a5f] text-slate-400 hover:text-white text-xs px-3 py-1 rounded cursor-pointer transition-colors">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-slate-300">{comment.content}</p>
                      {(canEdit || canDelete) && (
                        <div className="flex gap-3 mt-1">
                          {canEdit && (
                            <button onClick={() => startEdit(comment)} className="text-xs text-slate-500 hover:text-blue-400 bg-transparent border-none cursor-pointer transition-colors">
                              Editar
                            </button>
                          )}
                          {canDelete && (
                            <button onClick={() => handleDelete(comment.id)} className="text-xs text-slate-500 hover:text-red-400 bg-transparent border-none cursor-pointer transition-colors">
                              Eliminar
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
