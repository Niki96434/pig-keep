import { app } from './app'
import path from 'path'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db } from './core/db/'

const port = Number(process.env.PORT) || 3000

const bootstrap = async () => {
  const migrationsFolder = path.resolve(process.cwd(), 'migrations')
  await migrate(db, { migrationsFolder })
  app.listen(port)
}

bootstrap().catch((_err: Error) => {
  process.exit(1)
})
