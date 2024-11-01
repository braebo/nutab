import type { UserData } from './src/types'

import { url } from './src/url'

export async function createUser(email: string): Promise<{ phrase: string }> {
	const res = await fetch(`${url}/user`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			email,
		}),
	})

	const data = await res.json()

	return {
		phrase: data.phrase,
	}
}

export async function saveBoomarks(phrase: string, bookmarks: UserData) {
	await fetch(`${url}/${phrase}/bookmarks`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(bookmarks),
	})
}

export async function getBoomarks(phrase: string): Promise<UserData> {
	const res = await fetch(`${url}/${phrase}/bookmarks`, {
		method: 'GET',
	})

	const data = (await res.json()) as UserData

	return data
}
