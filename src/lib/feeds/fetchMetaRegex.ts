//! Regex fails bad... needs more work

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

const url_re = new RegExp(/^(https?:\/\/[^\/]+)/)
const title_re = [
	new RegExp(/<title>(.*?)<\/title>/),
	new RegExp(/(?:<meta[^/]*?)(?=(?:.*?name)="(?:title)")(?:(?=.*?content="(.*?)")).*(?:\/)*>/)
]
const description_re = new RegExp(
	/(?:<meta[^/].*?)(?=(?:.*?name)="(?:description)")(?:(?=.*?content="(.*?)")).*(?:\/)*>/
)
const image_re = new RegExp(/(?:<meta[^/].*?)(?=(?:.*?property)="(?:og:image)")(?:(?=.*?content="(.*?)")).*(?:\/)*>/)
const icon_re = new RegExp(/(?:<link[^/].*?)(?=(?:.*?rel)="(?:icon)")(?:(?=.*?href="(.*?)")).*(?:\/)*>/)

/**
 * Fetches a url and parses the meta tags.
 * @param url URL of the page to fetch.
 * @returns A promise that resolves to the metadata.
 * @example const meta = await fetchMeta('https://news.ycombinator.com/')
 */
export const fetchMeta = async (url: string) => {
	const head = await fetchHead(url)
	const match_url = url_re.exec(head) || url
	const match_title = title_re.map((re) => re.exec(head)) || ''
	const match_description = description_re.exec(head) || ''
	const match_image = image_re.exec(head) || ''
	const match_icon = icon_re.exec(head) || ''
	console.log({ match_url })
	console.log({ match_title })
	console.log({ match_description })
	console.log({ match_image })
	console.log({ match_icon })
	const metadata: IMeta = {
		url: url_re.exec(head)?.[1] || url,
		title: title_re.map((re) => re.exec(head))?.[0]?.[1] || '',
		description: description_re.exec(head)?.[1] || '',
		image: image_re.exec(head)?.[1] || '',
		icon: icon_re.exec(head)?.[1] || ''
	}
	return metadata
}

export default fetchMeta
