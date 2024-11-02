import { settings } from '$lib/stores/settings.svelte'
import { createGradient } from './createGradient'
import { randomColor } from '$lib/utils'

export const randomizeBackground = async (theme: keyof typeof settings.theme) => {
	const themeSettings = settings.theme[theme]
	themeSettings.gradientA = randomColor()
	themeSettings.gradientB = randomColor()
	themeSettings.background = createGradient(theme)
}
