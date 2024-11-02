import { randomizeBackground } from './randomizeBackground'
import { settings } from '$lib/stores/settings.svelte'
import { themer } from '$lib/theme/themer.svelte'

export const initBackground = () => {
	if (settings.sharedTheme) {
		if (!settings.theme.shared.lockBackground) {
			randomizeBackground('shared')
		}
		return
	}

	if (themer.mode in settings.theme && !settings.theme[themer.mode].lockBackground) {
		randomizeBackground(themer.mode)
	}
}
