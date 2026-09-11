import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

// Script standalone: roda as migrations do diretorio ./drizzle sem depender
// do drizzle-kit (devDependency) nem do env.ts completo. Usado como
// pre-deployment command no Coolify.
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error("DATABASE_URL ausente")
  process.exit(1)
}

const migrationsFolder = process.env.MIGRATIONS_FOLDER ?? "./drizzle"

const sql = postgres(databaseUrl, { max: 1 })

try {
  await migrate(drizzle(sql), { migrationsFolder })
  console.log("Migrations aplicadas com sucesso")
} catch (error) {
  console.error("Falha ao aplicar migrations:", error)
  process.exitCode = 1
} finally {
  await sql.end()
}
