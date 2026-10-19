import { app } from './app'
import path from 'path'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db, pool } from './core/db/'
import type { Server } from 'http'

const DEFAULT_PORT = 3000

const port = Number(process.env.PORT) || DEFAULT_PORT

let server: Server

const bootstrap = async () => {
  const migrationsFolder = path.resolve(process.cwd(), 'migrations')
  await migrate(db, {
    migrationsFolder,
    migrationsTable: 'migrations_table',
    migrationsSchema: 'migrations_schema',
  })
}

async function start() {
  try {
    await bootstrap()
    server = app.listen(port)
  } catch (err) {
    console.error('the server terminated with', err)
    process.exit(1)
  }
}

async function shutdown(signal: 'SIGTERM' | 'SIGINT') {
  server.close(async (_err?: Error) => {
    console.log(`${signal} received. HTTP server on port ${port} closed`)

    await pool.end()
    console.log('Database pool closed')

    process.exit(0)
  })

  server.closeIdleConnections()

  setTimeout(() => {
    console.log('Shutdown timeout after 10s, forcing exit')
    process.exit(1)
  }, 10_000)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))

process.on('SIGINT', () => shutdown('SIGINT'))

await start()
