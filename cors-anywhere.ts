export default {
	async fetch(request: Request) {
		const url = new URL(request.url).searchParams.get('q')

		if (!url) {
			return new Response('No url provided', {
				status: 400,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*',
				},
			})
		}

		const response = await fetch(url, {
			method: request.method,
			headers: request.headers,
		})

		const headers = new Headers(response.headers)
		headers.set('Access-Control-Allow-Origin', '*')
		headers.set('Access-Control-Allow-Headers', '*')

		const responseClone = new Response(response.body, { headers })

		return responseClone
	},
}
