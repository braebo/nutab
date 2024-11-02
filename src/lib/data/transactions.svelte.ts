import type { Bookmark, Folder, FolderListItem } from './types'

import { defaultFolder } from './bookmarks/defaults'
import { nanoid } from '$lib/utils/nanoid'
import { logger } from '$lib/utils/logger'
import dexie from './dexie.svelte'
import { db } from './db.svelte'
import { DEV } from 'esm-env'

const log = logger('Transactions', { fg: 'darksalmon', server: false, browser: DEV })

/**
 * Load bookmarks, or generate default bookmarks if none exist.
 */
export async function init_db() {
	log('🏁 Database found.')
	log('🏁 activeFolderId:', db.activeFolderId)

	// Get the last active folder
	await new Promise((r) => setTimeout(r, 100))
	const id = db.activeFolderId ?? defaultFolder.folder_id

	// Populate stores
	let lastActiveFolder: Folder | undefined
	if (id) {
		lastActiveFolder = await dexie.table('folders').where('folder_id').equals(id).first()
	}

	// If no last active folder, use the first one
	// All of this might not be necessary...
	if (!lastActiveFolder) {
		const defaultFolder = await dexie.table('folders').toArray()
		if (defaultFolder.length > 0) {
			localStorage.removeItem('lastActiveFolderId')
			lastActiveFolder = defaultFolder[0]
		} else {
			throw new Error('❌ Failed to initialize database: No folders found')
		}
	}
}

/**
 * Adds a new bookmark to the bookmarks table.
 * @param bookmark - The bookmark to add.
 */
export async function addBookmark_db(bookmark: Bookmark) {
	log('🎬 Creating new bookmark: ')

	// Todo: Consolidate this into a single transaction?

	// Add to bookmarks table
	await dexie.bookmarks
		.put(bookmark)
		.catch((e) => console.warn('Error adding bookmark', e, bookmark))

	if (!db.activeFolder) {
		throw new Error('activeFolder not found')
	}
	if (!db.activeFolder.bookmark_ids) {
		throw new Error('activeFolder.bookmarks not found')
	}

	// Add id to activeFolder store
	db.activeFolder.bookmark_ids.push(bookmark.bookmark_id)

	const folder = db.activeFolder
	// Replace Folder table's bookmarks with new array
	await dexie.folders
		.update(folder, {
			bookmark_ids: folder.bookmark_ids,
		})
		.catch((e) => console.warn('Error updating folder', e, folder))

	log('🏁 New Bookmark added')
}

/**
 * Creates a new folder.
 * @param folder - The folder to add.
 */
export async function addFolder_db(folder: Folder) {
	log('🎬 Creating new folder:', folder)

	// Clear any filters
	db.tagFilter = ''

	// Add to folders table
	await dexie.folders.add(folder)

	log('🏁 New Folder added')
}

/**
 * Get's the id's of any bookmarks containing a tag from an array of tags
 * @param tags An array of tags
 * @returns An array of bookmark ids
 */
export const getBookmarksWithSelectedTags_db = async (
	tags: string[],
): Promise<Bookmark['bookmark_id'][]> => {
	// Get all relevant bookmarks
	const allBookmarks = await dexie.bookmarks.where('tags').anyOf(tags).toArray()

	// Filter out duplicates (some share multiple tags)
	const uniques = new Set()
	const bookmarks = allBookmarks.reduce((prev, curr) => {
		if (!uniques.has(curr.title)) {
			uniques.add(curr.title)
			prev = [...prev, curr]
			log(prev)
		} else log(`Found duplicate: ${curr.title}`)
		return prev
	}, [] as Bookmark[])

	// Give them unique id's so they can be deleted without affecting other folders.
	bookmarks.forEach((b) => {
		b.bookmark_id = nanoid()
	})
	// Add them to the bookmarks table
	await dexie.bookmarks.bulkAdd(bookmarks)

	return bookmarks.map((b) => b.bookmark_id)
}

/**
 * Gets bookmark settings.
 * @param id - The id of the bookmark to retrieve.
 */
export async function getBookmark_db(id?: Bookmark['bookmark_id']) {
	if (!id) return

	log(`🎬 Getting bookmark with id of ${id}`)

	return await dexie.bookmarks.where('bookmark_id').equals(id).first()
}

/**
 *
 * Get's all folders.
 * @returns All folders
 */
export const getAllFolders_db = async (): Promise<FolderListItem[]> => {
	log('Getting folders')
	const allFolders: Folder[] = await dexie.folders.toArray()
	return allFolders.map((f) => ({ folder_id: f.folder_id, icon: f.icon, title: f.title }))
}

/**
 * Gets folder settings.
 * @param id - The id of the folder to retrieve.
 */
export const getFolder_db = async (id: Folder['folder_id']) => {
	log(`🎬 Getting folder with id of ${id}`)

	return dexie.folders.where('folder_id').equals(id).first()
}

/**
 * Counts total folders.
 * @returns The number of folders in the database.
 */
export const getFolderCount_db = () => dexie.folders.count()

/**
 * Updates the db after an index/position swap.
 */
export const swapBookmarks_db = async (bookmarks: Bookmark[]) => {
	return new Promise((resolve) => {
		console.log('swapBookmarks_db(): bookmarks:', bookmarks)
		// Update each bookmark to store the new position
		bookmarks.forEach((b) => {
			dexie.bookmarks.put(b)
		})

		// Update in folder (activeBookmarks store is already updated)
		if (!db.activeFolder) {
			throw new Error('activeFolder not found')
		}

		dexie.folders
			.update(db.activeFolder, {
				bookmark_ids: db.activeBookmarks?.map((b) => b.bookmark_id),
			})
			.then(resolve)
	})
}

/**
 * Deletes a bookmark.
 * @param id - The id of the bookmark to delete.
 */
export const deleteBookmark_db = async (id: Bookmark['bookmark_id']) => {
	log(`🎬 Deleting bookmark with id of ${id}`)

	const bookmarks = db.activeBookmarks
	if (!bookmarks) {
		throw new Error('Failed to delete bookmark: db.activeBookmarks is falsey')
	}

	// Remove from bookmarks store and update positions
	let found = false
	bookmarks.forEach((b, i) => {
		if (id === b.bookmark_id) {
			bookmarks.splice(i, 1)
			found = true
		}
		if (found) b.position = i
	})

	// Delete from bookmarks table
	await dexie.bookmarks.delete(id)

	// Replace bookmarks db table to update positions
	await dexie.bookmarks.bulkPut(bookmarks)

	// Update folder table
	if (!db.activeFolder) {
		throw new Error('activeFolder not found')
	}
	await dexie.folders.update(db.activeFolder, {
		bookmark_ids: bookmarks.map((b) => b.bookmark_id),
	})

	log('🏁 Bookmark deleted')
}

/**
 * Deletes a folder
 * @param folder - The folder to delete.
 */
export async function deleteFolder_db(folder: Folder) {
	const id = folder.folder_id
	log(`🎬 Deleting folder "${folder.title}" with id of ${id}`)

	const before = await dexie.bookmarks.count()

	// Remove the folder's bookmarks
	await dexie.bookmarks.bulkDelete(folder.bookmark_ids)
	const after = await dexie.bookmarks.count()
	log('🏁 Removed ' + (before - after) + ' bookmarks')

	// Delete from folders table
	await dexie.folders.delete(id)

	// Update activeFolder store if the deleted folder was active
	if (db.activeFolder?.folder_id === id) {
		const fallbackFolder = await dexie.folders.orderBy('folder_id').first()
		if (!fallbackFolder) {
			throw new Error('fallbackFolder not found')
		}
	}
	log('🏁 Folder deleted')
}

/**
 * Updates a bookmark.
 * @param bookmark - The bookmark to update.
 */
export async function updateBookmark_db(bookmark: Bookmark) {
	log('🎬 Updating bookmark:', bookmark)
	await dexie.bookmarks.put(bookmark)
	log('🏁 Bookmark updated')
}

/**
 * Puts a folder.
 * @param folder - The folder to put.
 */
export async function putFolder_db(folder: Folder) {
	log('🎬 Putting folder:', folder)
	await dexie.folders.put(folder)
	log('🏁 Folder updated')
}

/**
 * Updates the activeFolderId in dexie.settings (from which much of the app's state is derived).
 * @param id - The id of the folder to set as active.
 */
export async function updateActiveFolderId_db(id: Folder['folder_id']) {
	await dexie.settings.put({ key: 'activeFolderId', value: id })
}
