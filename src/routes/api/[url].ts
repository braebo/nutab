import type { RequestHandler } from '@sveltejs/kit'

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
