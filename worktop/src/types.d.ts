import type { Bookmark, Folder } from '../../src/lib/data/types'
import type { KV } from 'worktop/cfw.kv'
import type { Context } from 'worktop'

export interface WorktopContext extends Context {
	bindings: {
		USERS: KV.Namespace
		BOOKMARKS: KV.Namespace
	}
}

export interface User {
	email?: string
}

export interface Bookmarks {
	bookmarks: Bookmark[]
	folders: Folder[]
}
