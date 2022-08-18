import type { Folder } from '$lib/data/types'
import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'

export const folderEditor: Writable<Folder> = writable()

export const folderEditorContext: Writable<'edit' | 'create'> = writable()
