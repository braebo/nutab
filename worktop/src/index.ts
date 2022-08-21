import type { WorktopContext } from './types'

import { Router, compose } from 'worktop'
import * as CORS from 'worktop/cors'
import { start } from 'worktop/cfw'

import { post_bookmarks, get_bookmarks } from './routes/bookmarks'
import { new_user } from './routes/user'

const API = new Router<WorktopContext>()

API.prepare = compose(
	CORS.preflight({
		maxage: 3600 * 6,
		credentials: true,
	}),
)

API.add('POST', '/user', new_user)

API.add('POST', '/:phrase/bookmarks', post_bookmarks)
API.add('GET', '/:phrase/bookmarks', get_bookmarks)

export default start(API.run)
