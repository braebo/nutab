import type { Bookmark } from './types'

import { defaultBookmarks, defaultFolder } from './bookmarks/defaults'
import { activeFolder } from './dbStore'
import { log } from 'fractils'
import db from './db'
import Dexie from 'dexie'

/**
 * Default bookmark folder and bookmarks db tables.
 * @param  {BookmarkDB} db
 */
export async function initDB() {
	// Add default tables if they don't exist
	if (Dexie.exists('bookmarks') && Dexie.exists('folders')) {
		log('🎬 Adding default Bookmark Folder: ', '#fa8', 'dimgray', 25)

		await db.bookmarks.bulkAdd(defaultBookmarks)
		await db.folders.add(defaultFolder)
		activeFolder.set(defaultFolder)

		log('🏁 Add Defaults Complete', '#fa8', 'dimgray', 25)
	} else log('🏁 Databse found.', '#fa8', 'dimgray', 25)
}

/**
 * Creates a new bookmark.
 * @param  {bookmark} The bookmark to add.
 */
export async function newBookmark(bookmark: Bookmark) {
	log('🎬 Creating new bookmark: ', '#fa8', 'dimgray', 25)
	log(bookmark)

	await db.bookmarks.add(bookmark)

	log('🏁 New Bookmark added', '#fa8', 'dimgray', 25)
}

/**
 * Gets bookmark settings.
 * @param  {id} The id of the bookmark to retrieve.
 */
export async function getBookmark(id: Bookmark['bookmark_id']) {
	log(`🎬 Getting bookmark with id of ${id}`, '#fa8', 'dimgray', 25)

	const bookmark = db.bookmarks.where('bookmark_id').equals(id).first()

	log('🏁 Bookmark retrieved:', '#fa8', 'dimgray', 25)
	log(bookmark)

	return bookmark
}
