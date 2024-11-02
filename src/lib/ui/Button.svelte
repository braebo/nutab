<!-- 
	@component
	A simple button with a `<slot/>`
	@event on:click
	@styleprop --width ?? `max-content`
	@styleprop --bg ?? `var(--fg-a)`
	@styleprop --color ?? `var(--bg-a)`
	@styleprop --border ?? `1px solid transparent`
	@styleprop --bgHover
	@styleprop --borderHover ?? `1px solid var(--bg-a)`
	@styleprop --colorHover
 -->

<script lang="ts">
	import type { Snippet } from 'svelte'

	let { children, onclick = () => {} }: { children?: Snippet; onclick?: () => void } = $props()
</script>

<button {onclick}>
	{#if children}{@render children()}{:else}Click Me{/if}
</button>

<style>
	button {
		width: var(--width, max-content);
		min-width: max-content;
		height: 2.3rem;

		color: var(--color, var(--bg-a));
		border: var(--border, 1px solid transparent);
		border-radius: 5px;
		background: var(--bg, var(--fg-a));
		box-shadow: 0 1px 2px #00000022;

		font-family: var(--font-a);

		cursor: pointer;
		transition: 0.2s;

		transform: scale(1);
	}
	button:hover {
		background: var(--bgHover);
		border: var(--borderHover, 1px solid var(--bg-d));
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
