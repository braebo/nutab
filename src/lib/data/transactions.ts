import type { Bookmark, Folder } from './types'

import { activeBookmarks, activeFolder, activeFolderBookmarks, tagFilter } from './dbStore'
import { log, wait } from 'fractils'
import { get } from 'svelte/store'
import db from './db'


/**
 ** Default bookmark folder and bookmarks db tables.
 * @param  {BookmarkDB} db
 */
export async function init_db() {
	//? Get the last active folder
	log('🏁 Database found.', '#fa8', 'dimgray', 25)
	await wait(100)
	const id = localStorage.getItem('lastActiveFolderId')

	//? Update stores
	let lastActiveFolder: Folder | undefined
	lastActiveFolder = await db.table('folders').where('folder_id').equals(id).first()
	activeFolder.set(lastActiveFolder)
	activeBookmarks.set(await db.bookmarks.bulkGet(lastActiveFolder.bookmarks))
}


/**
 ** Creates a new bookmark.
 * @param  {bookmark} The bookmark to add.
 */
export async function newBookmark_db(bookmark: Bookmark) {
	log('🎬 Creating new bookmark: ', '#fa8', 'dimgray', 25)
	log(bookmark)

	// Todo: Consolidate this into a single transaction?

	//? Add to bookmarks table
	await db.bookmarks.add(bookmark)

	//? Add id to activeFolder store
	activeFolder.update((f) => {
		f.bookmarks = [...f.bookmarks, bookmark.bookmark_id]
		return f
	})

	//? Replace Folder table's bookmarks with new array
	await db.folders.update(get(activeFolder), {
		bookmarks: get(activeFolder).bookmarks
	})

	//? Update activeBookmarks store
	console.log(get(tagFilter))
	if (get(tagFilter) != null) {
		activeBookmarks.set(await get(activeFolderBookmarks))
	}

	log('🏁 New Bookmark added', '#fa8', 'dimgray', 25)
}


/**
 ** Gets bookmark settings.
 * @param  {id} The id of the bookmark to retrieve.
 */
export async function getBookmark_db(id: Bookmark['bookmark_id']) {
	log(`🎬 Getting bookmark with id of ${id}`, '#fa8', 'dimgray', 25)

	return db.bookmarks.where('bookmark_id').equals(id).first()
}


/**
 ** Updates the db after an index/position swap.
 */
export async function swapBookmarks_db(bookmarks: Bookmark[]) {
	//? Update each bookmark to store the new position
	bookmarks.forEach((b) => {
		db.bookmarks.put(b)
	})

	//? Update in folder (activeBookmarks store is already updated)
	await db.folders.update(get(activeFolder), {
		bookmarks: get(activeBookmarks).map((b) => b.bookmark_id)
	})
}


/**
 ** Deletes a bookmark.
 * @param  {id} The id of the bookmark to delete.
 * @param  {folder} The folder to delete the bookmark from.
 */
export async function deleteBookmark_db(id: Bookmark['bookmark_id']) {
	log(`🎬 Deleting bookmark with id of ${id}`, '#fa8', 'dimgray', 25)

	const bookmarks = get(activeBookmarks)

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
		f.bookmarks = bookmarks.map((b) => b.bookmark_id)
		return f
	})

	//? Update bookmarks store
	activeBookmarks.set(bookmarks)

	//? Delete from bookmarks table
	await db.bookmarks.delete(id)

	//? Replace bookmarks db table to update positions
	await db.bookmarks.bulkPut(bookmarks)

	//? Update folder table
	await db.folders.update(get(activeFolder), { bookmarks: bookmarks.map(b => b.bookmark_id) })

	log('🏁 Bookmark deleted', '#fa8', 'dimgray', 25)
}


/**
 ** Updates a bookmark.
 * @param  {bookmark} The bookmark to update.
 */
export async function updateBookmark_db(bookmark: Bookmark) {
	log('🎬 Updating bookmark: ', '#fa8', 'dimgray', 25)
	log(bookmark)

	await db.bookmarks.put(bookmark)
	activeBookmarks.update(v => v.map(b => b.bookmark_id === bookmark.bookmark_id ? bookmark : b))

	log('🏁 Bookmark updated', '#fa8', 'dimgray', 25)
}
