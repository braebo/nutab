<script>
	// @ts-nocheck
	import { fade } from 'svelte/transition'
	import { onMount } from 'svelte'

	export let size
	let mounted = false
	onMount(() => (mounted = true))

	const p = (max) => Math.floor(Math.random() * Math.floor(max)) // random star position
	const s = (max) => (Math.random() * Math.floor(max)).toFixed(2) // random star size
</script>

{#if mounted}
	<div
		class="star-container"
		style="width:{size * 1.5}px; height: {size}px"
		out:fade
		in:fade={{ delay: 750, duration: 2000 }}
	>
		{#each Array(15).fill() as star}
			<!-- prettier-ignore -->
			<div style="--star-size: {String(s(3) / 3) + 'px'}">
			<figure style="top:{p(100)}%;left:{p(100)}%;animation-delay:{p(3)}s;" class="star">
        	    <figure class="star-top" />
        	    <figure class="star-bottom" />
        	</figure>
		</div>
		{/each}
	</div>
{/if}

<style>
	.star-container {
		position: absolute;
		overflow: hidden;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		z-index: 0;
		border-radius: 100%;
	}
	figure {
		margin: 0;
		padding: 0;
		border: 0;
		outline: none;
		box-sizing: border-box;
		width: var(--star-size);
		height: var(--star-size);
		backface-visibility: hideen;
	}
	.star {
		display: block;
		position: absolute;
		top: 25%;
		left: 25%;

		background: white;
		border-radius: 99px;

		overflow: hidden;
		z-index: 2;

		animation: glitter 8s linear 0s infinite;
		animation-play-state: playing;
	}
	@keyframes glitter {
		0% {
			-webkit-transform: scale(1);
			opacity: 0.5;
		}
		25% {
			-webkit-transform: scale(0.5);
			opacity: 0;
		}
		50% {
			-webkit-transform: scale(1);
			opacity: 1;
		}
		75% {
			-webkit-transform: scale(0.5);
			opacity: 0;
		}
		100% {
			-webkit-transform: scale(1);
			opacity: 0.3;
		}
	}
</style>
