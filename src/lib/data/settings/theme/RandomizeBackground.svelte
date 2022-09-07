<script lang="ts">
	import { randomizeBackground } from '$lib/theme'
	import { settings, type Settings } from '$lib/stores'
	import { tweened } from 'svelte/motion'
	import { onDestroy } from 'svelte'

	export let thisTheme: keyof Settings['theme']

	let timer: NodeJS.Timeout
	let targetHue = 0
	const hue = tweened(0, { duration: 1000 })
	const animate = tweened(0, { duration: 100 })
	const handleClick = () => {
		if ($settings.theme[thisTheme].lockBackground) return
		randomizeBackground(thisTheme)
		targetHue += 360
		$hue = targetHue
		$animate = 1
		clearTimeout(timer)
		timer = setTimeout(() => {
			$animate = 0
		}, 1000)
	}

	onDestroy(() => {
		clearTimeout(timer)
	})
</script>

<div
	class="btn randomize"
	on:click={() => handleClick()}
	style="filter: hue-rotate({Math.floor($hue)}deg) saturate(10) ;"
>
	Randomize
</div>

<style lang="scss">
	.randomize {
		cursor: pointer;
		background: #fafaff;
		color: black;
	}
</style>
