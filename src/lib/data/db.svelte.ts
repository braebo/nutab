import type { Folder, Bookmark } from './types'

import { EventManager } from '$lib/utils/EventManager.svelte'
import { RuneQuery } from './RuneQuery.svelte'
import dexie from '$lib/data/dexie.svelte'
import { liveQuery } from 'dexie'

class BookmarksDB {
	/**
	 * A tag by which to filter the active folder's bookmarks, or `null` to show all bookmarks.
	 * @state
	 */
	public tagFilter = $state<string>('')

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
	public activeFolder = $derived.by(() => {
		this.folders
		return this.folders?.find((f) => f.folder_id === this.activeFolderId) ?? null
	})

	#bookmarks = new RuneQuery(
		liveQuery(async () => (await dexie.bookmarks.toArray()) as Bookmark[]),
	)
	public bookmarks = $derived(this.#bookmarks.current)

	public activeBookmarks = $derived.by(() => {
		const ids = this.activeFolder?.bookmark_ids ?? []
		const active = this.bookmarks?.filter((b) => ids.includes(b.bookmark_id))
		const filtered = this.tagFilter ? this.#filterByTag(active ?? []) : active
		return filtered?.sort((a, b) => a.position - b.position) ?? []
	})

	#uniqueTags = new RuneQuery(
		liveQuery(async () => (await dexie.bookmarks.orderBy('tags').uniqueKeys()) as string[]),
	)

	/**
	 * All unique tags in the database.
	 * @derived
	 */
	public uniqueTags = $derived(this.#uniqueTags.current)

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
			if (!curr.tags.some((t) => t === this.tagFilter)) return acc
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
