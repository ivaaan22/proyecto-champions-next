import { prisma } from "@/lib/prisma"
import TeamsClient from "./TeamsClient"

export default async function TeamsPage() {
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } })
  return <TeamsClient teams={teams} />
}
