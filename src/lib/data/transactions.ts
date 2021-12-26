import type { Bookmark } from './types'

import defaultFolder from './folders/defaultFolder'
import { activeFolder } from './dbStore'
import { log } from 'fractils'
import db from './db'

/**
 * Initializes default bookmark folder.
 * @param  {BookmarkDB} db
 * @returns {Folder} default_folder
 */
export async function addDefaultFolder() {
	log('🎬 Adding default Bookmark Folder: ', '#fa8', 'dimgray', 25)

	await db.folders.add(defaultFolder)
	activeFolder.set(defaultFolder)

	log('🏁 Add Defaults Complete', '#fa8', 'dimgray', 25)
}

/**
 * Creates a new bookmark.
 * @param  {BookmarkDB} db
 * @returns {Folder} bookmark
 */
export async function newBookmark(bookmark: Bookmark, folder_id?: string) {
	log('🎬 Creating new bookmark: ', '#fa8', 'dimgray', 25)
	log(bookmark)

	await db.folders.add(defaultFolder)
	activeFolder.set(defaultFolder)

	log('🏁 New Bookmark added', '#fa8', 'dimgray', 25)
}
