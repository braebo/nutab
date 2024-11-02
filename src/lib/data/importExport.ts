import { addBookmark_db } from './transactions.svelte'
import { exportDB } from 'dexie-export-import'
import { nanoid } from '$lib/utils/nanoid'
import dexie from './dexie.svelte'

/**
 * Saves the current bookmarks to a json file.
 */
export const exportBookmarks = async () => {
	const blob = await exportDB(dexie, { prettyJson: true })
	const a = document.createElement('a')
	a.href = URL.createObjectURL(blob)
	a.download = 'nutab-bookmarks.json'
	a.click()
}

/**
 * Imports bookmarks from a json file.
 * @remark Bookmarks are currently added to the active folder.
 * It would be nice to add them to their respective folders instead,
 * creating said folders if they don't exist.
 */
export const importBookmarks = async () => {
	const fileEl = document.createElement('input')
	fileEl.type = 'file'
	fileEl.accept = '.json'
	fileEl.click()
	fileEl.onchange = async () => {
		try {
			const file = fileEl.files?.[0]
			if (!file) return console.error('No file selected.')
			const blob = file.slice(0, file.size, 'application/json')
			const json = JSON.parse(await blob.text())
			const { data } = json.data

			const bookmarks = data?.filter(
				(t: Record<string, unknown>) => t.tableName === 'bookmarks',
			)?.[0]?.rows

			if (!bookmarks) return console.error('No bookmarks found in file.')

			for (const bookmark of bookmarks) {
				bookmark.bookmark_id = nanoid()
				addBookmark_db(bookmark)
			}
		} catch (e) {
			console.error(e)
		}
	}
}
