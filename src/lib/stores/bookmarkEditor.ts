import type { Bookmark } from '$lib/data/types'
import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'

export const bookmarkEditor: Writable<Bookmark> = writable()
