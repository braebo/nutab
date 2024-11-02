import type { ThemeConfigs } from '$lib/data/types'

import { randomBackground } from '$lib/utils'

/**
 * Generates a set of default theme configs.
 */
export function defaultThemeConfigs(): ThemeConfigs {
	const sharedBG = randomBackground()
	const lightBG = randomBackground()
	const darkBG = randomBackground()

	const shared = {
		background: sharedBG.gradient,
		lockBackground: false,
		customGradient: false,
		gradientA: sharedBG.a,
		gradientB: sharedBG.b,
		gradientOpacity: sharedBG.opacity,
	}

	type Theme = typeof shared

	const light: Theme = {
		...shared,
		background: lightBG.gradient,
		gradientA: lightBG.a,
		gradientB: lightBG.b,
		gradientOpacity: lightBG.opacity,
	}

	const dark: Theme = {
		...shared,
		background: darkBG.gradient,
		gradientA: darkBG.a,
		gradientB: darkBG.b,
		gradientOpacity: darkBG.opacity,
	}

	return { shared, light, dark }
}
