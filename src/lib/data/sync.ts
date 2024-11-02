import { settings } from '$lib/stores/settings.svelte'
import { init_db } from './transactions.svelte'
import { userPhrase } from './user'
import dexie from './dexie.svelte'
import { DEV } from 'esm-env'

const url = DEV ? 'http://localhost:8787' : 'https://nutab-sync.braebo.dev'

async function getUserData() {
	const bookmarks = await dexie.table('bookmarks').toArray()
	const folders = await dexie.table('folders').toArray()
	const s = $state.snapshot(settings)

	return {
		email: s.email,
		data: {
			settings: s,
			bookmarks,
			folders,
		},
	}
}

/**
 * Saves a user's bookmarks to the database.
 * @param phrase The user's phrase.
 */
export const postBookmarks = async (phrase: string) => {
	const data = await getUserData()

	const res = await fetch(`${url}/${phrase}/bookmarks`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	if (!res.ok) {
		console.error('Failed to save bookmarks')
	}

	return res.status
}

/**
 * Gets a user's bookmarks from the database.
 * @param phrase The user's phrase.
 * @returns
 */
export const getBookmarks = async (phrase: string) => {
	const res = await fetch(`${url}/${phrase}/bookmarks`)

	if (!res.ok) {
		console.error('Failed to load bookmarks')
	}

	const { bookmarks, folders, settings: newSettings } = await res.json()

	await dexie.table('bookmarks').clear()
	await dexie.table('folders').clear()

	await dexie.table('bookmarks').bulkPut(bookmarks)
	await dexie.table('folders').bulkPut(folders)
	if (newSettings) {
		Object.assign(settings, newSettings)
	}

	await init_db()

	return res.status
}

/**
 * Creates a new user in the database.
 */
export const createUser = async () => {
	const data = await getUserData()

	const res = await fetch(`${url}/user`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'content-type': 'application/json',
		},
	})

	if (!res.ok) {
		console.error('Failed to create user')
	}

	const { phrase } = await res.json()

	userPhrase.set(phrase)

	return res.status
}
