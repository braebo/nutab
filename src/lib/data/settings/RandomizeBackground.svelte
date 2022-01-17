<script lang="ts">
	import { randomBackground } from './randomBackground'

	let timer: NodeJS.Timeout
	let animate = false
	const handleClick = () => {
		document.getElementById('svelte').style = randomBackground()
		clearTimeout(timer)
		animate = true
		timer = setTimeout(() => {
			animate = false
		}, 1000)
	}
</script>

{#key animate}
	<div class:animate class="btn randomize" on:click={() => handleClick()}>Shuffle Background</div>
{/key}

<style>
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
</style>
