import type { Bookmark, Folder } from './types'

import { activeBookmarks, activeFolder, lastActiveFolderId } from './dbStore'
import { defaultBookmarks, defaultFolder } from './bookmarks/defaults'
import { log } from 'fractils'
import Dexie from 'dexie'

export class BookmarkDB extends Dexie {
	public bookmarks: Dexie.Table<Bookmark, string>
	public folders: Dexie.Table<Folder, string>

	constructor() {
		super('BookmarksDB')
		this.version(1).stores({
			bookmarks: 'bookmark_id, *tags, title, position',
			folders: 'folder_id, *bookmarks, position',
		})
		this.bookmarks = this.table('bookmarks')
		this.folders = this.table('folders')
	}
}

const db: BookmarkDB = new BookmarkDB()

// Only runs once on initial db creation
db.on('populate', async () => {
	log('🎬 Adding default Bookmark Folder: ', '#fa8', 'dimgray', 25)

	// Add default bookmarks
	await db.bookmarks.bulkAdd(defaultBookmarks)

	// Add default folder
	await db.folders.add(defaultFolder)

	// Store folder ID in localStorage
	lastActiveFolderId.set(defaultFolder.folder_id)

	// Initialize activeFolder store
	activeFolder.set(defaultFolder)

	// Initialize activeBookmarks store
	activeBookmarks.set(defaultBookmarks)

	log('🏁 Add Defaults Complete', '#fa8', 'dimgray', 25)
})

export default db
