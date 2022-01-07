import type { Folder, Bookmark } from './types'

import { writable, derived } from 'svelte/store'
import { localStorageStore } from 'fractils'
import { liveQuery } from 'dexie'
import db from '$lib/data/db'

export const activeFolder = writable<Folder>()

//? Will always contain the current Folder's bookmarks
export const activeFolderBookmarks = derived(activeFolder, ($activeFolder) =>
	db.bookmarks.bulkGet($activeFolder?.bookmarks)
)

//? Seperate store that be manually set.  i.e. - to a tag-filtered array of bookmarks
export const activeBookmarks = writable<Bookmark[]>()

export const lastActiveFolderId = localStorageStore('lastActiveFolderId', '')

export const uniqueTags: any = liveQuery(async () => await db.bookmarks.orderBy('tags').uniqueKeys())

//? Filter bookmarks by tag
export const tagFilter = writable<string | null>(null)
export const filteredBookmarks = derived(tagFilter, async ($tagFilter) => {
	if ($tagFilter === null) return null
	return await db.bookmarks.where('tags').equals($tagFilter).toArray()
})
