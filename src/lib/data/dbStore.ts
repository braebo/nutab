import type { Folder, Bookmark, FolderListItem } from './types'
import type { Writable } from 'svelte/store'

import { localStorageStore, log } from 'fractils'
import { writable, derived } from 'svelte/store'
import { liveQuery } from 'dexie'
import db from '$lib/data/db'

/**
 ** A list of all folders (without their bookmarks) for the FolderSidebar list.
 */
export const folders = writable<FolderListItem[]>()
export const activeFolder = writable<Folder>()

//? Seperate store that be manually set.  i.e. - to a tag-filtered array of bookmarks
export const activeBookmarks = writable<Bookmark[]>()

export const lastActiveFolderId = localStorageStore('lastActiveFolderId', '')

export const uniqueTags = liveQuery(async () => await db.bookmarks.orderBy('tags').uniqueKeys())

//? Filter bookmarks by tag
export const tagFilter = writable<string | null>(null)
export const filteredBookmarks = derived(tagFilter, ($tagFilter, set) => {
	log('tagFilter', $tagFilter)
	if ($tagFilter === null) return null
	db.bookmarks.where('tags').equals($tagFilter).toArray().then(set)
	return () => {
		set = () => {}
	}
})

// Async Derived 😎 - https://github.com/sveltejs/svelte/issues/2118#issuecomment-492537687
//? If there is a tagFilter it's applied, else this is the active folder's bookmarks
export const activeFolderBookmarks = derived<Writable<Folder | string>[], Bookmark[]>(
	[activeFolder, tagFilter],
	([$activeFolder, $tagFilter], set) => {
		let bookmarks: Bookmark[] = []

		if ($tagFilter === null) {
			db.bookmarks.bulkGet(($activeFolder as Folder)?.bookmarks).then((b) => filterBookmarks(b).then(set))
		} else {
			db.bookmarks
				.where('tags')
				.equals($tagFilter as string)
				.toArray()
				.then((b) => filterBookmarks(b).then(set))
		}

		async function filterBookmarks(bookmarks: Bookmark[]) {
			//? Some folders have similar bookmarks with unique id's, so we
			//? need to filter out the duplicates.
			const uniqueTitles = new Set()
			const uniqueBookmarks = bookmarks.reduce((acc, curr) => {
				if (!uniqueTitles.has(curr.title)) {
					uniqueTitles.add(curr.title)
					return [...acc, curr]
				}
				return acc
			}, [])
			return uniqueBookmarks
		}

		return () => {
			set = () => {}
		}
	}
)
