import type { Env } from './types'

import { new_user, save_user_data, get_user_data } from './routes/user'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { Hono } from 'hono'

const app = new Hono<Env>()
	.use('*', logger())
	.use('*', cors())
	.post('/user', new_user)
	.post('/user/:phrase', save_user_data)
	.get('/user/:phrase', get_user_data)

export type SyncWorker = typeof app

export default app
