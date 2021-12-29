import type { Bookmark, Folder } from './types'
import Dexie from 'dexie'

export class BookmarkDB extends Dexie {
	bookmarks: Dexie.Table<Bookmark, number>
	folders: Dexie.Table<Folder, number>

	constructor() {
		super('BookmarksDB')
		this.version(1).stores({
			bookmarks: 'bookmark_id, position, *tags',
			folders: 'folder_id, *bookmarks, position'
		})
		this.bookmarks = this.table('bookmarks')
		this.folders = this.table('folders')
	}
}

const db: BookmarkDB = new BookmarkDB()

export default db
