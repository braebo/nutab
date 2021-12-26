import type { Writable } from 'svelte/store'
import type { Collection } from './types'
import { writable } from 'svelte/store'

export const activeCollection: Writable<Collection> = writable()
