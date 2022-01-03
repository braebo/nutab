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
		gridWidth: Range
		gridGap: Range
		iconSize: Range
	}
	transparent: boolean
	showTitle: boolean
	invertDark?: boolean
}

const default_settings: Settings = {
	ranges: {
		gridWidth: { label: 'Grid Width', value: 1000, range: { min: 500, max: 2000 } },
		iconSize: { label: 'Icon Size', value: 50, range: { min: 0, max: 150 } },
		gridGap: { label: 'Spacing', value: 25, range: { min: 0, max: 100 } }
	},
	transparent: true,
	showTitle: false
}

export const settings = localStorageStore('settings', default_settings)

export const showSettings = writable(false)

// Used to show grid borders while updating gridWidth
export const showGuidelines = writable(false)
