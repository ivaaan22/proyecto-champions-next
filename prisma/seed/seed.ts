import "dotenv/config"
import { PrismaClient } from "@prisma/client"

// En Prisma 7 la URL se lee desde prisma.config.ts automáticamente
const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  const teams = [
    { name: "Real Madrid",   country: "España",     crest: "https://crests.football-data.org/86.png"   },
    { name: "Barcelona",     country: "España",     crest: "https://crests.football-data.org/81.png"   },
    { name: "Bayern",        country: "Alemania",   crest: "https://crests.football-data.org/5.png"    },
    { name: "Inter",         country: "Italia",     crest: "https://crests.football-data.org/108.png"  },
    { name: "Arsenal",       country: "Inglaterra", crest: "https://crests.football-data.org/57.png"   },
    { name: "PSG",           country: "Francia",    crest: "https://crests.football-data.org/524.png"  },
    { name: "Liverpool",     country: "Inglaterra", crest: "https://crests.football-data.org/64.png"   },
    { name: "Man. City",     country: "Inglaterra", crest: "https://crests.football-data.org/65.png"   },
    { name: "Atlético",      country: "España",     crest: "https://crests.football-data.org/78.png"   },
    { name: "Juventus",      country: "Italia",     crest: "https://crests.football-data.org/109.png"  },
    { name: "Dortmund",      country: "Alemania",   crest: "https://crests.football-data.org/4.png"    },
    { name: "AC Milan",      country: "Italia",     crest: "https://crests.football-data.org/98.png"   },
    { name: "Chelsea",       country: "Inglaterra", crest: "https://crests.football-data.org/61.png"   },
    { name: "Ajax",          country: "Holanda",    crest: "https://crests.football-data.org/678.png"  },
    { name: "Benfica",       country: "Portugal",   crest: "https://crests.football-data.org/1903.png" },
    { name: "Porto",         country: "Portugal",   crest: "https://crests.football-data.org/246.png"  },
    { name: "Leverkusen",    country: "Alemania",   crest: "https://crests.football-data.org/3.png"    },
    { name: "Aston Villa",   country: "Inglaterra", crest: "https://crests.football-data.org/58.png"   },
    { name: "Atalanta",      country: "Italia",     crest: "https://crests.football-data.org/102.png"  },
    { name: "Sporting CP",   country: "Portugal",   crest: "https://crests.football-data.org/498.png"  },
    { name: "Celtic",        country: "Escocia",    crest: "https://crests.football-data.org/732.png"  },
    { name: "Feyenoord",     country: "Holanda",    crest: "https://crests.football-data.org/675.png"  },
    { name: "Salzburg",      country: "Austria",    crest: "https://crests.football-data.org/1073.png" },
    { name: "Girona",        country: "España",     crest: "https://crests.football-data.org/298.png"  },
    { name: "Monaco",        country: "Francia",    crest: "https://crests.football-data.org/548.png"  },
    { name: "Club Brugge",   country: "Bélgica",    crest: "https://crests.football-data.org/851.png"  },
    { name: "PSV",           country: "Holanda",    crest: "https://crests.football-data.org/674.png"  },
    { name: "Dinamo Zagreb", country: "Croacia",    crest: "https://crests.football-data.org/755.png"  },
    { name: "Shakhtar",      country: "Ucrania",    crest: "https://crests.football-data.org/1887.png" },
    { name: "Estrella Roja", country: "Serbia",     crest: "https://crests.football-data.org/1967.png" },
    { name: "Real Betis",    country: "España",     crest: "https://crests.football-data.org/90.png"   },
    { name: "PAOK",          country: "Grecia",     crest: "https://crests.football-data.org/794.png"  },
  ]

  for (const team of teams) {
    await prisma.team.upsert({
      where:  { name: team.name },
      update: {},
      create: team,
    })
  }

  console.log(`✅ ${teams.length} equipos creados`)

  const get = (name: string) => prisma.team.findUniqueOrThrow({ where: { name } })
  const [realMadrid, bayern, inter, arsenal, psg, dortmund, liverpool, barcelona, manCity, atletico] =
    await Promise.all([
      get("Real Madrid"), get("Bayern"),   get("Inter"),     get("Arsenal"),
      get("PSG"),         get("Dortmund"), get("Liverpool"), get("Barcelona"),
      get("Man. City"),   get("Atlético"),
    ])

  await prisma.match.deleteMany()

  const matches = [
    { date: "14 MAY 2024", phase: "FASE_DE_GRUPOS" as const, homeId: realMadrid.id, awayId: bayern.id,    homeScore: 2, awayScore: 1, status: "done"     as const },
    { date: "14 MAY 2024", phase: "FASE_DE_GRUPOS" as const, homeId: inter.id,      awayId: arsenal.id,   homeScore: 1, awayScore: 1, status: "done"     as const },
    { date: "14 MAY 2024", phase: "FASE_DE_GRUPOS" as const, homeId: psg.id,        awayId: dortmund.id,  homeScore: 3, awayScore: 2, status: "done"     as const },
    { date: "14 MAY 2024", phase: "FASE_DE_GRUPOS" as const, homeId: liverpool.id,  awayId: barcelona.id, homeScore: 0, awayScore: 0, status: "done"     as const },
    { date: "07 ABR 2024", phase: "CUARTOS"        as const, homeId: arsenal.id,    awayId: bayern.id,    homeScore: 1, awayScore: 0, status: "done"     as const },
    { date: "07 ABR 2024", phase: "CUARTOS"        as const, homeId: barcelona.id,  awayId: psg.id,       homeScore: 3, awayScore: 1, status: "done"     as const },
    { date: "07 ABR 2024", phase: "CUARTOS"        as const, homeId: realMadrid.id, awayId: manCity.id,   homeScore: 3, awayScore: 3, status: "done"     as const },
    { date: "07 ABR 2024", phase: "CUARTOS"        as const, homeId: inter.id,      awayId: atletico.id,  homeScore: 2, awayScore: 0, status: "done"     as const },
    { date: "14 MAY 2024", phase: "SEMIFINAL"      as const, homeId: realMadrid.id, awayId: barcelona.id, time: "21:00",              status: "upcoming" as const },
    { date: "22 MAY 2024", phase: "SEMIFINAL"      as const, homeId: bayern.id,     awayId: inter.id,     time: "21:00",              status: "upcoming" as const },
  ]

  for (const match of matches) {
    await prisma.match.create({ data: match })
  }

  console.log(`✅ ${matches.length} partidos creados`)
  console.log("🎉 Seed completado!")
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
