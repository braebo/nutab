import type { Bookmark, Folder, Settings } from '../../src/lib/data/types'
import type { Env as HonoEnv } from 'hono'

//? Hono env config
export interface Env extends HonoEnv {
	Bindings: {
		USER_DATA: KVNamespace
	}
}

/**
 * All data store
 */
export type UserData = {
	email?: string
	data: {
		bookmarks: Bookmark[]
		folders: Folder[]
		settings?: Settings
	}
}
