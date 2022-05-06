import type { ICategory, IHNItem } from './types'

import { writable } from 'svelte/store'

export const list = writable<IHNItem['id'][]>([])
export const currentCategory = writable<ICategory>('topstories')
