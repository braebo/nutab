<script lang="ts">
	import { settings, type Settings } from '$lib/stores'
	import { randomizeBackground } from '$lib/theme'
	import { tweened } from 'svelte/motion'
	import { onDestroy } from 'svelte'
	import { theme } from 'fractils'

	interface Props {
		thisTheme: keyof Settings['theme'];
	}

	let { thisTheme }: Props = $props();

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
			targetHue = 0
			$animate = 0
			hue.set(0, { duration: 0 })
		}, 1000)
	}

	onDestroy(() => {
		clearTimeout(timer)
	})

	let darkText = $derived(`hsl(${Math.floor($hue % 360)}, 50%, ${100 - $animate * 10}%)`)
	let lightText = $derived(`hsl(${Math.floor($hue % 360)}, 50%, ${$animate * 10}%)`)
</script>

<div
	class="btn randomize"
	onclick={() => handleClick()}
	style="
		filter: hue-rotate({Math.floor($hue)}deg) saturate(10);
		color: {$theme === 'dark' ? darkText : lightText}
	"
>
	Randomize
</div>

<style lang="scss">
	.randomize {
		cursor: pointer;
		background: #fafaff;
		color: black;
	}

	:global(:root[theme='dark']) .randomize {
		background: #0a0a0a;
		// color: white;
	}
</style>
