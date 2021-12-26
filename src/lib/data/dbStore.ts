import type { Writable } from 'svelte/store'
import type { Folder } from './types'
import { writable } from 'svelte/store'

export const activeFolder: Writable<Folder> = writable()
