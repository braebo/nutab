import { activeCollection } from './dbStore'
import defaultCollection from './collections/defaultCollection'
import db from './db'

// https://github.com/vitejs/vite/blob/main/packages/vite/src/node/logger.ts // TODO use this to make logger a thing
interface logOptions {
	str?: string
	color?: string
	font_size?: number
	obj?: Object
}

const defaults: logOptions = {
	str: '',
	color: 'orange',
	font_size: 25,
	obj: {}
}

// const verbose: boolean = false; // toggle to enable verbose debugging
const verbose = false
const log = (opts = defaults) => {
	const { str, color, font_size, obj } = opts
	if (verbose) {
		console.log(
			`%c${performance.now().toFixed(1)}: -- ${str}`,
			`font-size:${font_size}px;color:${color}`
		)
		if (obj) {
			console.log(obj)
		}
	} else {
		;(s?: string, c?: string, f?: number | string, o?: object) => {}
	}
}

/**
 * Initializes default bookmark collection.
 * @param  {BookmarkDB} db
 * @returns {Collection} default_collection
 */
export async function addDefaultCollection() {
	log('🎬 Adding default Bookmark Collection: ', 'lightpurple', 25)

	await db.collections.add(defaultCollection)
	activeCollection.set(defaultCollection)

	log('🏁 Add Defaults Complete', 'lightpurple', 25)
}

/**
 * Creates a new bookmark.
 * @param  {BookmarkDB} db
 * @returns {Collection} bookmark
 */
export async function newBookmark() {
	log('🎬 Creating new bookmark: ', 'lightpurple', 25)

	await db.collections.add(defaultCollection)
	activeCollection.set(defaultCollection)

	log('🏁 Add Defaults Complete', 'lightpurple', 25)
}
