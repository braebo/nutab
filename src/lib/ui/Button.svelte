<script>
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<!-- 
	@component
	A simple button with a `<slot/>`
	@event on:click
	@styleprop width ?? `max-content`
	@styleprop bg ?? `var(--light-a)`
	@styleprop color ?? `var(--dark-a)`
	@styleprop border ?? `1px solid transparent`
	@styleprop bgHover
	@styleprop borderHover ?? `1px solid var(--dark-a)`
	@styleprop colorHover
 -->

<button onclick={bubble('click')}>
	{#if children}{@render children()}{:else}Click Me{/if}
</button>

<style>
	button {
		width: var(--width, max-content);
		min-width: max-content;
		height: 2.3rem;

		/* padding: 0.5em 1em; */

		color: var(--color, var(--dark-a));
		border: var(--border, 1px solid transparent);
		border-radius: 5px;
		background: var(--bg, var(--light-a));
		box-shadow: 0 1px 2px #00000022;

		font-family: var(--font-a);

		cursor: pointer;
		transition: 0.2s;

		transform: scale(1);
	}
	button:hover {
		background: var(--bgHover);
		border: var(--borderHover, 1px solid var(--dark-d));
		color: var(--colorHover);
		box-shadow: 0 4px 8px #00000015;

		transform: scale(1.05);
		backface-visibility: hidden;
	}
	button:focus,
	button:active {
		box-shadow: 0 0 1.5px 1px var(--borderHover);

		transform: scale(0.95);
		transition: 0.1s;
	}
</style>
