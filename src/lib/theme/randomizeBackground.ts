import { settings, type Settings } from '$lib/stores'
import { createGradient } from './createGradient'
import { randomColor } from '$lib/utils'

export const randomizeBackground = async (theme: keyof Settings['theme']) => {
	settings.update((s) => {
		s.theme[theme].gradientA = randomColor()
		s.theme[theme].gradientB = randomColor()
		s.theme[theme].background = createGradient(theme)
		return s
	})
}
