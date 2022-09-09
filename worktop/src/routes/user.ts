import { User, WorktopContext } from '../types'
import { reply } from 'worktop/response'
import * as utils from 'worktop/utils'
import * as kv from 'worktop/cfw.kv'
import { Handler } from 'worktop'

interface Body {
	email?: string
}

export const new_user: Handler<WorktopContext> = async (req, ctx) => {
	const body = await utils.body<Body>(req)

	if (!body)
		return reply(400, {
			error: 'Bad Request',
			message: 'Missing a json body 🤨',
		})

	const res = await fetch('https://mnemonic.willow.sh/new')

	if (!res.ok)
		return reply(500, {
			error: 'Internal Error',
			message: 'Failed to generate phrase 😕',
		})

	const phrase: string[] = await res.json()

	await kv.write<User>(ctx.bindings.USERS, phrase.join('-'), body)

	return reply(201, { phrase })
}
