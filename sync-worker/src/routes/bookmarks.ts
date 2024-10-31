import { Bookmarks, Env } from '../types'
import { Handler } from 'hono'

export const post_bookmarks: Handler<Env> = async (c) => {
	// Read request body
	const body = await c.req.json<Bookmarks>()

	// If no body, return error
	if (!body) {
		c.status(400)
		return c.json({
			error: 'Bad Request',
			message: 'Missing a json body 🤨',
		})
	}

	// Get the phrase
	const phrase = c.req.query('phrase')

	// If no phrase, return error
	if (!phrase) {
		c.status(400)
		return c.json({
			error: 'Bad Request',
			message: 'Missing a user phrase 🤨',
		})
	}

	// Write bookmarks to kv
	await c.env.BOOKMARKS.put(phrase, JSON.stringify(body satisfies Bookmarks))

	// Return success
	return c.json({ message: 'Ok' })
}

export const get_bookmarks: Handler<Env> = async (c) => {
	// Grab the phrase from the url
	const phrase = c.req.query('phrase')

	if (!phrase) {
		c.status(400)
		return c.json({
			error: 'Bad Request',
			message: 'Missing a user phrase 🤨',
		})
	}

	// Read the bookmarks from the kv store
	const bookmarks = await c.env.BOOKMARKS.get(phrase)

	// If there are no bookmarks, return an empty array
	if (!bookmarks) {
		c.status(404)
		return c.json({ error: 'Not Found', message: 'Not Found' })
	}

	// Return the bookmarks
	return c.json(bookmarks)
}
