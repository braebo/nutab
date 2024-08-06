export const GET = async ({ params }) => {
	const res = await fetch(params.url, {
		headers: {
			Accept: 'text/html'
		}
	})

	console.log({ res })

	if (res.ok) {
		return res.clone();
	}

	return new Response(null, { status: 404 })
}
