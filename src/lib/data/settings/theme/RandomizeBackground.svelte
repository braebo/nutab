<script lang="ts">
	import { randomizeBackground } from '$lib/theme'
	import { settings, type Settings } from '$lib/stores'

	export let thisTheme: keyof Settings['theme']

	let timer: NodeJS.Timeout
	let animate = false
	const handleClick = () => {
		if ($settings.theme[thisTheme].lockBackground) return
		randomizeBackground(thisTheme)
		clearTimeout(timer)
		animate = true
		timer = setTimeout(() => {
			animate = false
		}, 1000)
	}
</script>

{#key animate}
	<div
		class:animate
		class="btn randomize"
		class:locked={$settings.theme[thisTheme].lockBackground}
		on:click={() => handleClick()}
	>
		Randomize
	</div>
{/key}

<style lang="scss">
	.animate {
		animation: colorize 1s infinite;
	}
	@keyframes colorize {
		from {
			background: #ff1;
			filter: hue-rotate(0deg);
		}
		to {
			filter: hue-rotate(360deg);
		}
	}
	.locked {
		opacity: 0.4;
		cursor: default;

		&:hover {
			color: var(--dark-d);
			cursor: not-allowed;
		}
	}
</style>
