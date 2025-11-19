import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL')
    // 如需影子库以稳定迁移，可加：
    // shadowDatabaseUrl: env('SHADOW_DATABASE_URL'),
  }
  // migrations: {
  //   seed: 'tsx prisma/seed.ts'
  // }
})
