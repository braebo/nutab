import type { Env } from './types'

import { post_bookmarks, get_bookmarks } from './routes/bookmarks'
import { new_user } from './routes/user'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { Hono } from 'hono'

const app = new Hono<Env>()

app.use('*', logger())
app.use('*', cors())

app.post('/user', new_user)

app.post('/:phrase/bookmarks', post_bookmarks)
app.get('/:phrase/bookmarks', get_bookmarks)

export default app
