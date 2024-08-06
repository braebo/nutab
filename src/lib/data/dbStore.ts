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

// Seperate store that is manually set.  i.e. - to a tag-filtered array of bookmarks
export const activeBookmarks = writable<Bookmark[]>()

export const lastActiveFolderId = localStorageStore('lastActiveFolderId', '')

export const uniqueTags = liveQuery(async () => await db.bookmarks.orderBy('tags').uniqueKeys())

// Filter bookmarks by tag
export const tagFilter = writable<string | null>(null)

/** The active folder's bookmarks, filtered by tag if applicable */
export const activeFolderBookmarks = derived<[Writable<Bookmark[]>, Writable<Folder>, Writable<string>], Bookmark[]>(
	[activeBookmarks, activeFolder, tagFilter],
	([$activeBookmarks, $activeFolder, $tagFilter], set) => {
		$activeBookmarks // Is this helping trigger updates?
		if ($tagFilter === null) {
			db.bookmarks.bulkGet(($activeFolder as Folder)?.bookmarks || []).then((b) => set(b))
		} else {
			db.bookmarks
				.where('tags')
				.equals($tagFilter as string)
				.toArray()
				.then((b) => filterBookmarks(b).then(set))
		}

		async function filterBookmarks(bookmarks: Bookmark[]) {
			// Some folders have similar bookmarks with unique id's, so we
			// need to filter out the duplicates.
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
	},
)
