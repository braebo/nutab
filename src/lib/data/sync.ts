import type { User } from './types'

import { init_db } from './transactions'
import { userPhrase } from './user'
import db from './db'

export const postBookmarks = async (phrase: string) => {
	const bookmarks = await db.table('bookmarks').toArray()
	const folders = await db.table('folders').toArray()

	const res = await fetch(`http://localhost:8787/${phrase}/bookmarks`, {
		method: 'POST',
		body: JSON.stringify({
			bookmarks,
			folders,
		}),
		headers: {
			'content-type': 'application/json',
		},
	})

	if (!res.ok) {
		console.error('Failed to save bookmarks')
	}

	return res.status
}

/**
 *
 * @param phrase The user's phrase
 * @returns
 */
export const getBookmarks = async (phrase: User['phrase']) => {
	const res = await fetch(`http://localhost:8787/${phrase}/bookmarks`)

	if (!res.ok) {
		console.error('Failed to load bookmarks')
	}

	const { bookmarks, folders } = await res.json()

	await db.table('bookmarks').clear()
	await db.table('folders').clear()

	await db.table('bookmarks').bulkPut(bookmarks)
	await db.table('folders').bulkPut(folders)

	await init_db()

	return res.status
}

export const createUser = async (email?: string) => {
	const res = await fetch('http://localhost:8787/user', {
		method: 'POST',
		body: JSON.stringify({ email }),
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
