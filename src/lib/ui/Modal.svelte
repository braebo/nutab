<script>
	import { clickOutside } from '../utils/clickOutside'
	import { fade } from 'svelte/transition'

	export let showModal = false
	export let opacity = 0.3
	export let background = `rgba(var(--light-d-rgb), ${opacity})`
</script>

{#if showModal}
	<div
		class="background"
		style="background-color: {background};"
		transition:fade={{ duration: 150 }}
	>
		<div class="wrapper" use:clickOutside on:click_outside={() => (showModal = false)}>
			<slot />
		</div>
	</div>
{/if}

<style>
	.background {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;

		width: 100vw;
		height: 100vh;

		z-index: 100;
	}
	.wrapper {
		width: max-content;
		height: max-content;
		margin: 0 auto;
	}
</style>
