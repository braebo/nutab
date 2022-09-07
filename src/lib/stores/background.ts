import { createActiveGradient } from '$lib/theme/createGradient'
import { derived } from 'svelte/store'
import { activeTheme } from './settingsStore'
// todo: move createActiveGradient to this file
export const activeBackground = derived(activeTheme, ($activeTheme) => {
	return createActiveGradient($activeTheme)
})
