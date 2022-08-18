import { derived, get } from 'svelte/store'
import { randomColor } from '$lib/utils'
import { settings } from './'

export const gradientBackground = derived([settings], ([$settings]) => {
	return `background-image: linear-gradient(to bottom, ${$settings.gradientA + $settings.gradientOpacity}, ${
		$settings.gradientB + $settings.gradientOpacity
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
