import { derived, get } from 'svelte/store'
import { randomColor } from '$lib/utils'
import { settings } from './'

export const gradientBackground = derived([settings], ([$settings]) => {
	const opacity = $settings.ranges.gradientOpacity?.value?.toString(16) ?? '30'
	return `background-image: linear-gradient(to bottom, ${$settings.gradientA + opacity}, ${
		$settings.gradientB + opacity
	});`
})

export const randomizeBackground = () => {
	settings.update((v) => {
		return { ...v, gradientA: randomColor(), gradientB: randomColor() }
	})
	settings.update((v) => {
		return { ...v, background: get(gradientBackground) }
	})
}
