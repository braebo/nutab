import { parse } from 'node-html-parser'

import metadataRuleSets from './rulesets'

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

const makeUrlAbsolute = (url, path) => new URL(path, new URL(url).origin).toString()

/**
 * Fetches a url and parses the meta tags.
 * @param url URL of the page to fetch.
 * @returns A promise that resolves to the metadata.
 * @example const meta = await fetchMeta('https://news.ycombinator.com/')
 */
export const fetchMeta = async (url) => {
	const head = await fetchHead(url)
	const dom = parse(head)
	const metadata = {
		url
	}
	for (const prop in metadataRuleSets) {
		for (const rule of metadataRuleSets[prop].rules) {
			const el = dom.querySelector(rule[0])
			if (el) {
				let data = rule[1](el)
				metadata[prop] = metadataRuleSets[prop].absolute ? makeUrlAbsolute(url, data) : data
				break
			}
		}
		if (!metadata[prop] && metadataRuleSets[prop].defaultValue) {
			metadata[prop] = makeUrlAbsolute(url, metadataRuleSets[prop].defaultValue)
		}
	}
	return metadata
}

export default fetchMeta
