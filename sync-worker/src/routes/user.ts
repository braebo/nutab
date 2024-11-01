import type { Env, UserData } from '../types'

import { Handler } from 'hono'

export const new_user: Handler<Env> = async (c) => {
	const body = await c.req.json<UserData>()

	const res = await fetch('https://mnemonic.willow.sh/new')
	if (!res.ok) {
		c.status(500)
		return c.json({
			error: 'Internal Error',
			message: 'Failed to generate phrase 😕',
		})
	}

	const phrase: string[] = await res.json()

	await c.env.USER_DATA.put(phrase.join('-'), JSON.stringify(body))

	return c.json({ phrase })
}

export const save_user_data: Handler<Env> = async (c) => {
	const body = await c.req.json<UserData>()

	const phrase = c.req.param('phrase')

	await c.env.USER_DATA.put(phrase, JSON.stringify(body))

	return c.json({ message: 'bookmarks saved 🎉' }, 200)
}

export const get_user_data: Handler<Env> = async (c) => {
	const phrase = c.req.param('phrase')

	const bookmarks = await c.env.USER_DATA.get(phrase, 'json')
	if (!bookmarks) {
		return c.json({ error: 'Not Found', message: 'Not Found' }, 404)
	}

	return c.json(bookmarks, 200)
}
