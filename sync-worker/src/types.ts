import type { Bookmark, Folder } from '../../src/lib/data/types'
import type { Env as HonoEnv } from 'hono'

//? Hono env config
export interface Env extends HonoEnv {
	Bindings: {
		USERS: KVNamespace
		BOOKMARKS: KVNamespace
	}
}

export interface User {
	email?: string
}

export interface Bookmarks {
	bookmarks: Bookmark[]
	folders: Folder[]
}
