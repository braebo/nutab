import { Bookmarks, WorktopContext } from '../types'
import { reply } from 'worktop/response'
import * as utils from 'worktop/utils'
import * as kv from 'worktop/cfw.kv'
import { Handler } from 'worktop'

export const post_bookmarks: Handler<WorktopContext> = async (req, ctx) => {
	// Read request body
	const body = await utils.body<Bookmarks>(req)

	// If no body, return error
	if (!body)
		return reply(400, {
			error: 'Bad Request',
			message: 'Missing a json body 🤨',
		})

	// Get the phrase
	const phrase = ctx.params.phrase

	// If no phrase, return error
	if (!phrase)
		return reply(400, {
			error: 'Bad Request',
			message: 'Missing a user phrase 🤨',
		})

	// Write bookmarks to kv
	await kv.write<Bookmarks>(ctx.bindings.BOOKMARKS, phrase, body)

	// Return success
	return reply(200, { message: 'Ok' })
}

export const get_bookmarks: Handler<WorktopContext> = async (req, ctx) => {
	// Grab the phrase from the url
	const phrase = ctx.params.phrase

	// Read the bookmarks from the kv store
	const bookmarks = await kv.read<Bookmarks>(ctx.bindings.BOOKMARKS, phrase)

	// If there are no bookmarks, return an empty array
	if (!bookmarks) return reply(404, { error: 'Not Found', message: 'Not Found' })

	// Return the bookmarks
	return reply(200, bookmarks)
}
