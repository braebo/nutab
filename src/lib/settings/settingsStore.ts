import localStorageStore from '$lib/utils/localStorageStore'
import { writable } from 'svelte/store'

type Range = {
	value: number
	range: { min: number; max: number }
}

export interface Settings {
	// Todo: add theme, language, etc.
	ranges: {
		gridSize: Range
		gridGap: Range
		iconSize: Range
	}
	transparent: boolean
	showTitle: boolean
}

const default_settings: Settings = {
	ranges: {
		gridSize: { value: 75, range: { min: 75, max: 250 } },
		gridGap: { value: 25, range: { min: 0, max: 100 } },
		iconSize: { value: 50, range: { min: 0, max: 150 } }
	},
	transparent: true,
	showTitle: false
}

export const settings = localStorageStore('settings', default_settings)

export const showSettings = writable(false)
