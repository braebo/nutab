// modified from https://github.com/luisivan/fetch-meta-tags for browser compat
import type { IMeta } from './types'

import { parse } from 'node-html-parser'
import { rulesets } from './rulesets'
import { CORS } from './constants'
import { dev } from '$app/env'

const fetchHead = async (url: string) => {
	const read = async (body: ReadableStream<Uint8Array> | null): Promise<string> =>
		new Promise(async (resolve) => {
			let head = ''
			const reader = body.getReader()
			const decoder = new TextDecoder()

			// Stream and decode the response body until the closing <head/> tag is found.
			reader.read().then(function next({ done, value }) {
				const text = decoder.decode(value)
				head += text
				const headBody = head.toString().split('</head>')

				if (headBody[1] !== undefined) {
					return resolve(`${headBody[0]}</head></html>`)
				}

				if (done) return resolve('')

				reader.read().then(next)
			})
		})

	try {
		const res = await fetch(url)
		if (!res.ok) return ''

		return read(res.body)
	} catch (e) {
		console.warn(e)
		return ''
	}
}

const makeUrlAbsolute = (url: string, path: string) => new URL(path, new URL(url).origin).toString()

/**
 * Fetches a url and parses the meta tags.
 * @param url URL of the page to fetch.
 * @returns A promise that resolves to the metadata.
 * @example const meta = await fetchMeta('https://news.ycombinator.com/')
 */
export const fetchMeta = async (url: string, imgOnly = false) => {
	const corsUrl = dev ? CORS + url : url

	const head = await fetchHead(corsUrl)
	const dom = parse(head)

	const metadata: IMeta = {
		url,
		title: '',
		description: '',
		icon: '',
		image: '',
	}

	for (const key in rulesets) {
		if (imgOnly && key !== 'image') continue

		for (const rule of rulesets[key].rules) {
			const el = dom.querySelector(rule[0])

			if (el) {
				let data = rule[1](el)

				metadata[key] = rulesets[key].absolute ? makeUrlAbsolute(url, data) : data
				break
			}
		}

		if (!metadata[key] && 'defaultValue' in rulesets[key]) {
			metadata[key] = makeUrlAbsolute(url, rulesets[key].defaultValue)
		}
	}
	return metadata
}

export default fetchMeta
