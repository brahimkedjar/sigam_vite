import * as fs from 'fs'
import * as csv from 'csv-parser'
import { PrismaClient, Pays } from '@prisma/client'

const prisma = new PrismaClient()

type PaysCSV = {
  Pays: string
  Code_pays: string
}

export async function main() {
  const paysData: Array<Pick<Pays, 'code_pays' | 'nom_pays'>> = []
  const csvFilePath = "C:\\Users\\ANAM1408\\Desktop\\BaseSicma_Urgence\\pays.csv"

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row: PaysCSV) => {
        paysData.push({ code_pays: (row as any).Code_pays, nom_pays: (row as any).Pays })
      })
      .on('end', () => resolve())
      .on('error', (e) => reject(e))
  })

  for (const pays of paysData) {
    await prisma.pays.upsert({
      where: { code_pays: pays.code_pays },
      update: {},
      create: pays,
    })
  }
}

if (require.main === module) {
  main()
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

