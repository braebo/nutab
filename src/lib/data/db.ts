import type { Bookmark, Folder } from './types'

import { defaultBookmarks, defaultFolder } from './bookmarks/defaults'
import { activeBookmarks, activeFolder, lastActiveFolderId } from './dbStore'
import { log } from 'fractils'
import Dexie from 'dexie'

export class BookmarkDB extends Dexie {
	bookmarks: Dexie.Table<Bookmark, string>
	folders: Dexie.Table<Folder, string>

	constructor() {
		super('BookmarksDB')
		this.version(1).stores({
			bookmarks: 'bookmark_id, *tags, position',
			folders: 'folder_id, *bookmarks, position'
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
