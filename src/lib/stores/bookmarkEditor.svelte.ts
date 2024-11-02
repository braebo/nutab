import type { Bookmark, Folder } from '$lib/data/types'

import { defaultFolder, emptyBookmark, emptyFolder } from '$lib/data/bookmarks/defaults'
import { getBookmark_db, getFolderCount_db } from '$lib/data/transactions.svelte'
import { debounce } from '$lib/utils/debounce'
import { Logger } from '$lib/utils/logger'
import { db } from '$lib/data/db.svelte'

type EditorContext = 'edit' | 'create'
type EditorType = 'bookmark' | 'folder'
type EditorMode = [EditorContext, EditorType]

class BookmarkEditorManager {
	bookmarkEditorContext = $state<EditorContext | null>(null)
	editorType = $state<EditorType | null>(null)

	editor = $state<Bookmark | null>(null)
	folderEditor = $state<Folder | null>(null)

	showFolderEditor = $state(false)
	showBookmarkEditor = $state(false)

	editorShown = $derived(this.showBookmarkEditor || this.showFolderEditor)

	#log: Logger

	constructor() {
		this.#log = new Logger('BookmarkEditor', { fg: 'teal' })
	}

	show = async (mode: EditorMode, i?: number) => {
		this.#log.fn('show').debug(`(${mode}, ${i})`)
		switch (String(mode)) {
			case 'create,bookmark':
				this.editor = emptyBookmark(db.activeFolder ?? defaultFolder)
				this.showBookmarkEditor = true
				break
			case 'edit,bookmark':
				if (i === undefined) console.error('editor: No index provided for bookmark')
				else {
					this.editor =
						(await getBookmark_db(db.activeBookmarks?.[i]?.bookmark_id)) ?? null
					this.showBookmarkEditor = true
				}
				break
			case 'create,folder':
				const folderCount = await getFolderCount_db()
				this.folderEditor = emptyFolder(folderCount)
				this.showFolderEditor = true
				break
			case 'edit,folder':
				this.showFolderEditor = true
				break
			default:
				console.error('editor: Invalid mode provided:', mode)
				break
		}
		this.bookmarkEditorContext = mode[0]
		this.editorType = mode[1]
	}

	hide = () => {
		this.folderEditor = null
		this.bookmarkEditorContext = null
		this.editorType = null
		this.showFolderEditor = false
		this.showBookmarkEditor = false
		// Avoids flashes during out:transition
		debounce(() => {
			this.editor = null
		}, 250)
	}
}

export const bookmarkEditor = new BookmarkEditorManager()
