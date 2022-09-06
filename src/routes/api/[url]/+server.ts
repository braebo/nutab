// throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

import type { RequestHandler } from './$types'

export const get: RequestHandler = async ({ params }) => {
	const res = await fetch(params.url, {
		headers: {
			Accept: 'text/html'
		}
	})

	console.log({ res })

	if (res.ok) {
		return {
			body: res.body
		}
	}

	return {
		status: 404
	}
}
