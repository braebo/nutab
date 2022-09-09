import type { Bookmark, Folder } from '$lib/data/types'

import { getBookmark_db, getFolderCount_db } from '$lib/data/transactions'
import { activeFolderBookmarks, activeFolder } from '$lib/data/dbStore'
import { emptyBookmark, emptyFolder } from '$lib/data/bookmarks/defaults'
import { writable, derived, get } from 'svelte/store'
import { log } from 'fractils'
import { debounce } from '$lib/utils/debounce'

type EditorContext = 'edit' | 'create'
type EditorType = 'bookmark' | 'folder'
type EditorMode = [EditorContext, EditorType]

export const bookmarkEditorContext = writable<EditorContext>()
export const editorType = writable<EditorType>()

export const bookmarkEditor = writable<Bookmark>()
export const folderEditor = writable<Folder>()

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
				bookmarkEditor.set(emptyBookmark(get(activeFolder)))
				showBookmarkEditor.set(true)
				break
			case 'edit,bookmark':
				if (i === null) console.error('editor: No index provided for bookmark')
				else {
					bookmarkEditor.set(await getBookmark_db(get(activeFolderBookmarks)[i].bookmark_id))
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
		debounce(() => bookmarkEditor.set(null), 250)
	},
}
Object.freeze(editor)
