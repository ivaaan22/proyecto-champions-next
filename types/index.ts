export type Role = "USER" | "EDITOR" | "ADMIN"
export type MatchStatus = "done" | "upcoming"
export type Phase = "FASE_DE_GRUPOS" | "CUARTOS" | "SEMIFINAL" | "FINAL"

export type Profile = {
  id: string
  email: string
  username: string | null
  avatarUrl: string | null
  role: Role
  createdAt: Date
  updatedAt: Date
}

export type Team = {
  id: number
  name: string
  country: string
  crest: string
  createdAt: Date
  updatedAt: Date
}

export type Match = {
  id: number
  date: string
  phase: Phase
  homeId: number
  awayId: number
  homeTeam?: Team
  awayTeam?: Team
  homeScore: number | null
  awayScore: number | null
  time: string | null
  status: MatchStatus
  comments?: Comment[]
  createdAt: Date
  updatedAt: Date
}

export type Comment = {
  id: number
  content: string
  matchId: number
  authorId: string
  author?: Profile
  createdAt: Date
  updatedAt: Date
}
