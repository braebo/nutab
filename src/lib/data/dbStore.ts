import type { Writable } from 'svelte/store'
import type { Folder } from './types'
import { writable } from 'svelte/store'
import { localStorageStore } from 'fractils'

export const activeFolder: Writable<Folder> = writable()

export const lastActiveFolderId = localStorageStore('lastActiveFolderId', '')
