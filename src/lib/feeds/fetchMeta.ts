export interface IMeta {
	url: string
	title: string
	description: string
	image: string
	icon: string
}

const fetchHead = async (url: string) => {
	const read = async (body: ReadableStream<Uint8Array> | null): Promise<string> =>
		new Promise(async (resolve) => {
			let head = ''
			const reader = body.getReader()
			const decoder = new TextDecoder()

			// Stream and decode the response body until the closing <head/> tag is found
			reader.read().then(function next({ done, value }) {
				const text = decoder.decode(value, { stream: !done })
				head += text

				const headBody = head.toString().split('</head>')[0]
				if (headBody !== undefined) {
					return resolve(`${headBody}</head></html>`)
				}
				if (done) return resolve('')

				reader.read().then(next)
			})
		})

	const res = await fetch(url)
	if (!res.ok) return ''
	return read(res.body)
}

/**
 * Fetches a url and parses the meta tags.
 * @param url URL of the page to fetch.
 * @returns A promise that resolves to the metadata.
 * @example const meta = await fetchMeta('https://news.ycombinator.com/')
 */
export const fetchMeta = async (url: string) => {
	const head = await fetchHead(url)
	const metadata: IMeta = {
		url: /<meta property="og:url" content="(.*?)"/.exec(head)?.[1] || url,
		title: /<meta name="title" content="(.*?)"/.exec(head)?.[1] || '',
		description: /<meta name="description" content="(.*?)"/.exec(head)?.[1] || '',
		image: /<meta property="og:image" content="(.*?)"/.exec(head)?.[1] || '',
		icon: /<link rel="icon" href="(.*?)"/.exec(head)?.[1] || ''
	}
	return metadata
}

export default fetchMeta
