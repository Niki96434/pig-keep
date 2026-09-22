import { app } from './app'
import path from 'path'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db } from './core/db/'

const DEFAULT_PORT = 3000

const port = Number(process.env.PORT) || DEFAULT_PORT

const bootstrap = async () => {
  const migrationsFolder = path.resolve(process.cwd(), 'migrations')
  await migrate(db, { migrationsFolder })
  app.listen(port)
}

bootstrap().catch((err: Error) => {
  console.log(err)
  process.exit(1)
})
