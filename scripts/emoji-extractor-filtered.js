// https://github.com/amio/emoji.json/blob/HEAD/scripts/gen.js

import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const EMOJI_VERSION = '14.0'

main()

// Unsupported on MacOS as of 01-08-2022
const unsupported = [
	'melting face',
	'face with open eyes and hand over mouth',
	'face with peeking eye',
	'saluting face',
	'dotted line face',
	'face with diagonal mouth',
	'face holding back tears',
	'leftwards hand',
	'rightwards hand',
	'palm down',
	'palm up hand',
	'hand with index finger and thumb crossed',
	'index pointing at the viewer',
	'heart hands',
	'biting lip',
	'jar',
	'hamsa',
	'mirror ball',
	'crutch',
	'bubbles',
	'troll',
	'coral',
	'lotus',
	'empty nest',
	'nest with eggs',
	'pouring liquid',
	'playground slide',
	'wheel',
	'ring buoy',
	'low battery',
	'x-ray',
	'identification card',
	'heavy equals sign',
	'keycap: #',
	'keycap: *',
	'keycap: 0',
	'keycap: 1',
	'keycap: 2',
	'keycap: 3',
	'keycap: 4',
	'keycap: 5',
	'keycap: 6',
	'keycap: 7',
	'keycap: 8',
	'keycap: 9',
	'keycap: 10'
]

const blacklist = ['skin', 'flag:', 'man', 'men', 'woman', 'women', 'person', 'couple', 'Animal']

const omit = [...unsupported, ...blacklist]

async function main() {
	const text = await getTestFile(EMOJI_VERSION)

	console.log(`Format text to json...`)
	const collected = text
		.trim()
		.split('\n')
		.reduce(
			(accu, line) => {
				//! Filter out omitted values
				if (omit.some((s) => line.includes(s))) {
					return accu
				}

				if (line.startsWith('# group: ')) {
					console.log(`  Processing ${line.substr(2)}...`)
					accu.group = line.substr(9)
				} else if (line.startsWith('# subgroup: ')) {
					console.log(`  Processing ${line.substr(2)}...`)
					// accu.subgroup = line.substr(12) //! Remove subgroup
				} else if (line.startsWith('#')) {
					accu.comments = accu.comments + line + '\n'
				} else {
					const meta = parseLine(line)
					if (meta) {
						// meta.category = `${accu.group} (${accu.subgroup})` //! Remove category
						meta.group = accu.group
						meta.subgroup = accu.subgroup
						//! Remove codes
						const { codes, ...m } = meta
						accu.full.push(m)
						// accu.full.push(meta)
						accu.compact.push(meta.char)
					} else {
						accu.comments = accu.comments.trim() + '\n\n'
					}
				}
				return accu
			},
			{ comments: '', full: [], compact: [] }
		)

	console.log(`Processed emojis: ${collected.full.length}`)

	console.log('Write file: emoji.json, emoji-compact.json \n')

	//! Remove duplicates
	const dedupeSet = new Set()
	const deduped = collected.full.reduce((acc, emoji) => {
		if (dedupeSet.has(emoji.name)) return acc
		dedupeSet.add(emoji.name)
		acc.push(emoji)
		return acc
	}, [])
	collected.full = deduped
	await writeFiles(collected)

	console.log(collected.comments)
}

async function getTestFile(ver) {
	const url = `https://unicode.org/Public/emoji/${ver}/emoji-test.txt`

	process.stdout.write(`Fetch emoji-test.txt (v${EMOJI_VERSION})`)
	return new Promise((resolve, reject) => {
		https.get(url, (res) => {
			let text = ''
			res.setEncoding('utf8')
			res.on('data', (chunk) => {
				process.stdout.write('.')
				text += chunk
			})
			res.on('end', () => {
				process.stdout.write('\n')
				resolve(text)
			})
			res.on('error', reject)
		})
	})
}

function parseLine(line) {
	const data = line.trim().split(/\s+[;#] /)

	if (data.length !== 3) {
		return null
	}

	if (line.includes('flag:')) {
		return null
	}

	const [codes, status, charAndName] = data
	const [, char, name] = charAndName.match(/^(\S+) E\d+\.\d+ (.+)$/)

	return { codes, char, name }
}

const rel = (...args) => path.resolve(__dirname, ...args)

function writeFiles({ full, compact }) {
	fs.writeFileSync(rel('./extracted/filtered/emoji.json'), JSON.stringify(full), 'utf8')
	fs.writeFileSync(rel('./extracted/filtered/emoji-compact.json'), JSON.stringify(compact), 'utf8')
}
