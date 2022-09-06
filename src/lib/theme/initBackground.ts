import { randomizeBackground } from './randomizeBackground'
import { settings } from '../stores/settingsStore'
import { theme } from 'fractils'
import { get } from 'svelte/store'

export const initBackground = () => {
	const s = get(settings)
	const t = get(theme) as 'light' | 'dark'

	if (s.sharedTheme) {
		if (!s.theme.shared.lockBackground) {
			randomizeBackground('shared')
		}
	} else if (t in s.theme && !s.theme[t].lockBackground) {
		randomizeBackground(t)
	}
}
