import { prisma } from "@/lib/prisma"
import MatchesClient from "./MatchesClient"

export default async function MatchesPage() {
  const matches = await prisma.match.findMany({
    orderBy: { createdAt: "desc" },
    include: { homeTeam: true, awayTeam: true },
  })
  return <MatchesClient matches={matches} />
}
