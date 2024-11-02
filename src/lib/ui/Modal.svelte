<script lang="ts">
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	import { clickOutside } from '../utils/clickOutside'
	import { fade } from 'svelte/transition'

	interface Props {
		showModal?: boolean
		opacity?: number
		background?: any
		children?: import('svelte').Snippet
	}

	let {
		showModal = $bindable(false),
		opacity = 0.3,
		background = `color-mix(in srgb, var(--fg-d) ${opacity * 100}%, transparent)`,
		children,
	}: Props = $props()
</script>

{#if showModal}
	<div
		class="background"
		style="background-color: {background};"
		transition:fade={{ duration: 150 }}
	>
		<div class="wrapper" use:clickOutside onoutclick={() => bookmarkEditor.hide()}>
			{@render children?.()}
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
