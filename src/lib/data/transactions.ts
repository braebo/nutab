import type { Bookmark, Folder } from './types'

import { defaultBookmarks, defaultFolder } from './bookmarks/defaults'
import { activeFolder, lastActiveFolderId } from './dbStore'
import { get } from 'svelte/store'
import { log, wait } from 'fractils'
import db from './db'

/**
 * Default bookmark folder and bookmarks db tables.
 * @param  {BookmarkDB} db
 */
export async function init_db() {
	//? Get the last active folder
	log('🏁 Database found.', '#fa8', 'dimgray', 25)
	await wait(100)
	const id = localStorage.getItem('lastActiveFolderId')

	//? Update activeFolder store
	let lastActiveFolder: Folder | undefined
	lastActiveFolder = await db.table('folders').where('folder_id').equals(id).first()
	activeFolder.set(lastActiveFolder)
}

/**
 * Creates a new bookmark.
 * @param  {bookmark} The bookmark to add.
 */
export async function newBookmark_db(bookmark: Bookmark) {
	log('🎬 Creating new bookmark: ', '#fa8', 'dimgray', 25)
	log(bookmark)

	// Todo: Consolidate this into a single transaction

	//? Add to bookmarks
	await db.bookmarks.add(bookmark)

	//? Update store
	activeFolder.update((f) => {
		f.bookmarks = [...f.bookmarks, bookmark]
		return f
	})

	//? Update in folder
	await db.folders.update(get(activeFolder), {
		bookmarks: get(activeFolder).bookmarks
	})

	log('🏁 New Bookmark added', '#fa8', 'dimgray', 25)
}

/**
 * Gets bookmark settings.
 * @param  {id} The id of the bookmark to retrieve.
 */
export async function getBookmark(id: Bookmark['bookmark_id']) {
	log(`🎬 Getting bookmark with id of ${id}`, '#fa8', 'dimgray', 25)

	return db.bookmarks.where('bookmark_id').equals(id).first()
}

/**
 * Updates a bookmark.
 */
export async function swapBookmarks_db(bookmarks: Bookmark[]) {
	//? Update each bookmark to store the new position
	bookmarks.forEach((b) => {
		db.bookmarks.put(b)
	})
	//? Update in folder (activeFolder store is already updated)
	await db.folders.update(get(activeFolder), {
		bookmarks: get(activeFolder).bookmarks
	})
}
