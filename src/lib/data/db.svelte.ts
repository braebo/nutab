import type { Folder, Bookmark } from './types'

import { EventManager } from '$lib/utils/EventManager.svelte'
import { RuneQuery } from './RuneQuery.svelte'
import dexie from '$lib/data/dexie.svelte'
import { liveQuery } from 'dexie'

class BookmarksDB {
	// /**
	//  * The active folder.
	//  * @state
	//  */
	// activeFolderId = $state<string>(defaultFolder.folder_id)
	// /**
	//  * The last active folder ID.
	//  * @state
	//  */
	// lastActiveFolderId = $state<string>(defaultFolder.folder_id)

	/**
	 * A tag by which to filter the active folder's bookmarks, or `null` to show all bookmarks.
	 * @state
	 */
	public tagFilter = $state<string | null>(null)

	#activeFolderId = new RuneQuery(
		liveQuery(async () => (await dexie.settings.get('activeFolderId'))?.value as string),
	)
	/**
	 * The active folder id.
	 * @derived
	 */
	public activeFolderId = $derived(this.#activeFolderId.current)

	#folders = new RuneQuery(
		liveQuery(async () => (await dexie.table('folders').toArray()) as Folder[]),
	)
	/**
	 * All folders in the database.
	 * @derived
	 */
	public folders = $derived(this.#folders.current)

	/**
	 * The active folder.
	 * @derived
	 */
	// public activeFolder = $derived(
	// 	this.folders?.find((f) => f.folder_id === this.activeFolderId) ?? null,
	// )
	public activeFolder = $derived.by(() => {
		this.folders
		return this.folders?.find((f) => f.folder_id === this.activeFolderId) ?? null
	})

	#bookmarks = new RuneQuery(
		liveQuery(async () => (await dexie.bookmarks.toArray()) as Bookmark[]),
	)
	public bookmarks = $derived(this.#bookmarks.current)

	public activeBookmarks = $derived.by(() => {
		this.activeFolder
		const ids = this.activeFolder?.bookmark_ids ?? []
		const active = this.bookmarks?.filter((b) => ids.includes(b.bookmark_id))
		console.log('📚📚', {
			ids,
			bookmarks: this.bookmarks,
			active,
		})
		return active
	})

	// #activeBookmarks = new RuneQuery(
	// 	liveQuery(async () => {
	// 		this.activeFolder
	// 		const activeFolderBookmarkKeys = (this.activeFolder as Folder)?.bookmarks ?? []
	// 		// console.log('🔵 activeFolderBookmarkKeys', activeFolderBookmarkKeys)
	// 		const bookmarks = await dexie.bookmarks.bulkGet(activeFolderBookmarkKeys)
	// 		// console.log('🟣 bookmarks', bookmarks)
	// 		return bookmarks as Bookmark[]
	// 	}),
	// )
	// /**
	//  * The active folder's bookmarks.
	//  * @derived
	//  */
	// public activeBookmarks = $derived(this.#activeBookmarks.current)

	#uniqueTags = new RuneQuery(
		liveQuery(async () => (await dexie.bookmarks.orderBy('tags').uniqueKeys()) as string[]),
	)
	/**
	 * All unique tags in the database.
	 * @derived
	 */
	public uniqueTags = $derived(this.#uniqueTags.current)

	// #filteredBookmarks = new RuneQuery(
	// 	liveQuery(async () => {
	// 		if (!this.tagFilter) return this.activeBookmarks

	// 		return await dexie.bookmarks
	// 			.where('tags')
	// 			.equals(this.tagFilter as string)
	// 			.toArray()
	// 			.then((b) => this.#filterByTag(b))
	// 	}),
	// )
	// /**
	//  * All bookmarks, filtered by tag when {@link tagFilter} is non-null.
	//  * @derived
	//  */
	// public filteredBookmarks = $derived(this.#filteredBookmarks.current)
	public filteredBookmarks = $derived.by(() => {
		if (!this.tagFilter) return this.activeBookmarks
		return this.#filterByTag(this.activeBookmarks ?? [])
	})

	#evm = new EventManager()

	constructor() {
		this.#evm.add(
			$effect.root(() => {
				$inspect('BookmarksDB', $state.snapshot(this))
				$inspect('🔴 BookmarksDB.activeFolderId', this.activeFolderId)
				$inspect('🟠 BookmarksDB.folders', this.folders)
				$inspect('🟡 BookmarksDB.activeFolder', this.activeFolder)
				$inspect('🟢 BookmarksDB.activeBookmarks', this.activeBookmarks)
			}),
		)
	}

	/**
	 * Some folders have similar bookmarks with unique id's, so we filter out the duplicates here.
	 */
	#filterByTag(bookmarks: Bookmark[]) {
		const uniqueTitles = new Set()
		return bookmarks.reduce((acc, curr) => {
			if (!uniqueTitles.has(curr.title)) {
				uniqueTitles.add(curr.title)
				return [...acc, curr]
			}
			return acc
		}, [] as Bookmark[])
	}

	/**
	 * Cleanup function.
	 */
	dispose = () => this.#evm.dispose()
}

export const db = new BookmarksDB()
