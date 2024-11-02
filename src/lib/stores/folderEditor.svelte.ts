import type { Folder } from '$lib/data/types'

class FolderEditor {
	editor = $state<Folder>()
	context = $state<'edit' | 'create'>()
}

export const folderEditor = new FolderEditor()
