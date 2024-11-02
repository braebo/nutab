import type { Bookmark, Folder } from './types'
import type { EntityTable } from 'dexie'

import { defaultBookmarks, defaultFolder } from './bookmarks/defaults'
import { Logger } from '$lib/utils/logger'
// import { db } from './db.svelte'
import Dexie from 'dexie'

const log = new Logger('Dexie', { fg: 'tomato' }).log

class DexieBookmarks extends Dexie {
	bookmarks!: EntityTable<Bookmark, 'bookmark_id'>
	folders!: EntityTable<Folder, 'folder_id'>
	settings!: EntityTable<{ key: string; value: string }, 'key'>

	constructor() {
		super('BookmarksDB')
		this.version(1).stores({
			bookmarks: 'bookmark_id, *tags, title, position',
			folders: 'folder_id, *bookmarks, position',
			settings: 'key',
		})
	}
}

const dexie = new DexieBookmarks()

// Runs once
dexie.on('populate', async () => {
	log('🎬 Initializing BookmarksDB:', { defaultFolder })

	// Add default bookmarks
	await dexie.bookmarks
		.bulkAdd(defaultBookmarks)
		.catch((e) => console.warn('Error adding default bookmarks', e))

	// Add default folder
	await dexie.folders
		.add(defaultFolder)
		.catch((e) => console.warn('Error adding default folder', e))

	// Set default folder as active
	await dexie.settings.put({ key: 'activeFolderId', value: defaultFolder.folder_id }, 'key')

	// setTimeout(() => {
	// 	log('🏁 BookmarksDB initialized.', {
	// 		activeFolderId: $state.snapshot(db.activeFolderId),
	// 		activeFolder: $state.snapshot(db.activeFolder),
	// 		activeBookmarks: $state.snapshot(db.activeBookmarks),
	// 		defaultFolder,
	// 	})
	// }, 100)
})

export default dexie
