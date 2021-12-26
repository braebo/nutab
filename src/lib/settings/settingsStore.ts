import localStorageStore from '$lib/utils/localStorageStore'
import { writable } from 'svelte/store'

type Range = {
	label: string
	value: number
	range: { min: number; max: number }
}

export interface Settings {
	// Todo: add theme, language, etc.
	ranges: {
		cellSize: Range
		gridGap: Range
		iconSize: Range
	}
	transparent: boolean
	showTitle: boolean
}

const default_settings: Settings = {
	ranges: {
		cellSize: { label: 'Cell Size', value: 75, range: { min: 75, max: 250 } },
		iconSize: { label: 'Icon Size', value: 50, range: { min: 0, max: 150 } },
		gridGap: { label: 'Grid Gap', value: 25, range: { min: 0, max: 100 } }
	},
	transparent: true,
	showTitle: false
}

export const settings = localStorageStore('settings', default_settings)

export const showSettings = writable(false)
