import type { Writable } from 'svelte/store'
import type { Folder } from './types'

import { writable } from 'svelte/store'
import { localStorageStore } from 'fractils'
import db from '$lib/data/db'
import { liveQuery } from 'dexie'

export const activeFolder: Writable<Folder> = writable()

export const lastActiveFolderId = localStorageStore('lastActiveFolderId', '')

export const uniqueTags = liveQuery(async () => await db.bookmarks.orderBy('tags').uniqueKeys())

// Filter bookmarks by tag
export const tagFilter = writable<string | null>(null)
