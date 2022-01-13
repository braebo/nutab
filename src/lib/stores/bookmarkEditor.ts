import type { Bookmark, Folder } from '$lib/data/types'

import { getBookmark_db, getFolderCount_db, getFolder_db } from '$lib/data/transactions'
import { activeBookmarks, activeFolder, folders } from '$lib/data/dbStore'
import { emptyBookmark, emptyFolder } from '$lib/data/bookmarks/defaults'
import { writable, get } from 'svelte/store'
import { log } from 'fractils'

type EditorContext = 'edit' | 'create'
type EditorType = 'bookmark' | 'folder'
type EditorMode = [EditorContext, EditorType]

export const editorContext = writable<EditorContext>()
export const editorType = writable<EditorType>()

export const bookmarkEditor = writable<Bookmark>()
export const folderEditor = writable<Folder>()

export const showEditor = writable(false)

export const editor = {
	show: async (mode: EditorMode, i?: number) => {
		log(`editor.show(${mode}, ${i})`, '#111', '#aad', 25)
		switch (String(mode)) {
			case 'create,bookmark':
				bookmarkEditor.set(emptyBookmark(get(activeFolder)))
				break
			case 'edit,bookmark':
				if (i === null) console.error('editor: No index provided for bookmark')
				else bookmarkEditor.set(await getBookmark_db(get(activeBookmarks)[i].bookmark_id))
				break
			case 'create,folder':
				folderEditor.set(emptyFolder(await getFolderCount_db()))
				break
			case 'edit,folder':
				if (i === null) console.error('editor: No index provided for folder')
				else folderEditor.set(await getFolder_db(get(folders)[i].folder_id))
				break
			default:
				console.error('editor: Invalid mode provided:', mode)
				break
		}
		editorContext.set(mode[0])
		editorType.set(mode[1])
		showEditor.set(true)
	},
	hide: () => {
		bookmarkEditor.set(null)
		folderEditor.set(null)
		editorContext.set(null)
		editorType.set(null)
		showEditor.set(false)
	}
}
Object.freeze(editor)
