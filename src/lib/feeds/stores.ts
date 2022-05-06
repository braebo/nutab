import type { ICategory, IHNItem } from './types'

import { writable } from 'svelte/store'

export const currentCategory = writable<ICategory>('topstories')

export const list = writable<IHNItem['id'][]>([])

export const items = writable<IHNItem[]>([])
