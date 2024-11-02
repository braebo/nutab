// import type { Folder, Bookmark, FolderListItem } from './types'
// import type { Writable } from 'svelte/store'

// import { writable, derived } from 'svelte/store'
// import { localStorageStore } from 'fractils'
// import dexie from '$lib/data/dexie.svelte'
// import { liveQuery } from 'dexie'

// /**
//  ** A list of all folders (without their bookmarks) for the FolderSidebar list.
//  */
// export const folders = writable<FolderListItem[]>()
// export const activeFolder = writable<Folder>()

// // Seperate store that is manually set.  i.e. - to a tag-filtered array of bookmarks
// export const activeBookmarks = writable<Bookmark[]>()

// export const lastActiveFolderId = localStorageStore('lastActiveFolderId', '')

// export const uniqueTags = liveQuery<string[]>(
// 	async () => (await dexie.bookmarks.orderBy('tags').uniqueKeys()) as string[],
// )

// // Filter bookmarks by tag
// export const tagFilter = writable<string | null>(null)

// /** The active folder's bookmarks, filtered by tag if applicable */
// export const activeFolderBookmarks = derived<
// 	[Writable<Bookmark[]>, Writable<Folder>, Writable<string>],
// 	Bookmark[]
// >(
// 	// @ts-expect-error ...
// 	[activeBookmarks, activeFolder, tagFilter!],
// 	([$activeBookmarks, $activeFolder, $tagFilter], set) => {
// 		if ($activeBookmarks) {
// 			// todo- Is this even helping trigger updates?
// 		}
// 		if ($tagFilter === null) {
// 			// // @ts-expect-error ...
// 			dexie.bookmarks
// 				.bulkGet(($activeFolder as Folder)?.bookmark_ids || [])
// 				.then((b) => set(b.filter(Boolean) as Bookmark[]))
// 		} else {
// 			dexie.bookmarks
// 				.where('tags')
// 				.equals($tagFilter as string)
// 				.toArray()
// 				// @ts-expect-error ...
// 				.then((b) => filterBookmarks(b).then(set))
// 		}

// 		async function filterBookmarks(bookmarks: Bookmark[]) {
// 			// Some folders have similar bookmarks with unique id's, so we
// 			// need to filter out the duplicates.
// 			const uniqueTitles = new Set()
// 			// @ts-expect-error ...
// 			const uniqueBookmarks = bookmarks.reduce((acc, curr) => {
// 				if (!uniqueTitles.has(curr.title)) {
// 					uniqueTitles.add(curr.title)
// 					return [...acc, curr]
// 				}
// 				return acc
// 			}, [])
// 			return uniqueBookmarks
// 		}

// 		return () => {
// 			set = () => {}
// 		}
// 	},
// )
