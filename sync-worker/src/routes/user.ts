import { User, Env } from '../types'
import { Handler } from 'hono'

interface Body {
	email?: string
}

export const new_user: Handler<Env> = async (c) => {
	const body = await c.req.json<Body>()

	if (!body) {
		c.status(400)
		return c.json({
			error: 'Bad Request',
			message: 'Missing a json body 🤨',
		})
	}

	const res = await fetch('https://mnemonic.willow.sh/new')

	if (!res.ok) {
		c.status(500)
		return c.json({
			error: 'Internal Error',
			message: 'Failed to generate phrase 😕',
		})
	}

	const phrase: string[] = await res.json()

	await c.env.USERS.put(phrase.join('-'), JSON.stringify(body satisfies User))

	return c.json({ phrase })
}
