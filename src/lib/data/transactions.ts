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

/**
 * Deletes a bookmark.
 * @param  {id} The id of the bookmark to delete.
 * @param  {folder} The folder to delete the bookmark from.
 */
export async function deleteBookmark_db(id: Bookmark['bookmark_id']) {
	log(`🎬 Deleting bookmark with id of ${id}`, '#fa8', 'dimgray', 25)

	const bookmarks = get(activeFolder).bookmarks

	//? Remove from bookmarks store and update positions
	let found = false
	bookmarks.forEach((b, i) => {
		if (id === b.bookmark_id) {
			bookmarks.splice(i, 1)
			found = true
		}
		if (found) b.position = i
	})

	//? Update folder store
	activeFolder.update((f) => {
		f.bookmarks = bookmarks
		return f
	})

	//? Delete from bookmarks
	await db.bookmarks.delete(id)

	//? Replace bookmarks db table to update positions
	await db.bookmarks.bulkPut(bookmarks)

	//? Update in folder
	await db.folders.update(get(activeFolder), { bookmarks })

	log('🏁 Bookmark deleted', '#fa8', 'dimgray', 25)
}
