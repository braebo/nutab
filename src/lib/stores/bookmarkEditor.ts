import type { Bookmark, Folder } from '$lib/data/types'

import { getBookmark_db, getFolderCount_db } from '$lib/data/transactions.svelte'
// import { activeFolderBookmarks, activeFolder } from '$lib/data/dbStore'
import { emptyBookmark, emptyFolder } from '$lib/data/bookmarks/defaults'
import { writable, derived } from 'svelte/store'
// import { debounce } from '$lib/utils/debounce'
import { db } from '$lib/data/db.svelte'
import { log } from 'fractils'

type EditorContext = 'edit' | 'create'
type EditorType = 'bookmark' | 'folder'
type EditorMode = [EditorContext, EditorType]

export const bookmarkEditorContext = writable<EditorContext | null>(null)
export const editorType = writable<EditorType | null>(null)

export const bookmarkEditor = writable<Bookmark | null>(null)
export const folderEditor = writable<Folder | null>(null)

export const showFolderEditor = writable<boolean>(false)
export const showBookmarkEditor = writable<boolean>(false)

export const editorShown = derived(
	[showBookmarkEditor, showFolderEditor],
	([$showBookmarkEditor, $showFolderEditor]) => $showBookmarkEditor || $showFolderEditor,
)

export const editor = {
	show: async (mode: EditorMode, i?: number) => {
		log(`editor.show(${mode}, ${i})`, '#111', '#aad', 25)
		switch (String(mode)) {
			case 'create,bookmark':
				if (db.activeFolder) bookmarkEditor.set(emptyBookmark(db.activeFolder))
				else console.error('editor: No active folder')
				showBookmarkEditor.set(true)
				break
			case 'edit,bookmark':
				if (i === null) console.error('editor: No index provided for bookmark')
				else {
					const bookmark = await getBookmark_db(db.activeBookmarks?.[i ?? 0]?.bookmark_id)
					if (bookmark) bookmarkEditor.set(bookmark)
					else console.error('editor: Bookmark not found')
					showBookmarkEditor.set(true)
				}
				break
			case 'create,folder':
				const folderCount = await getFolderCount_db()
				folderEditor.set(emptyFolder(folderCount))
				showFolderEditor.set(true)
				break
			case 'edit,folder':
				showFolderEditor.set(true)
				break
			default:
				console.error('editor: Invalid mode provided:', mode)
				break
		}
		bookmarkEditorContext.set(mode[0])
		editorType.set(mode[1])
	},
	hide: () => {
		folderEditor.set(null)
		bookmarkEditorContext.set(null)
		editorType.set(null)
		showFolderEditor.set(false)
		showBookmarkEditor.set(false)
		// Avoids flases during out:transition
		setTimeout(() => bookmarkEditor.set(null), 250)
	},
}
Object.freeze(editor)
