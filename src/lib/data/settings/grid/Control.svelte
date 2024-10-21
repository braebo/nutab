<script lang="ts">
	import { fly } from 'svelte/transition'

	interface Props {
		label?: string;
		i?: number;
		children?: import('svelte').Snippet;
	}

	let { label = '', i = 1, children }: Props = $props();
</script>

<div class="control" in:fly={{ y: 10, duration: 300, delay: 100 + 33 * i }} out:fly={{ y: 10, duration: 100 }}>
	{#if label}<label for={label}>{label}</label>{/if}
	<div class="range" class:fullWidth={label}>
		{@render children?.()}
	</div>
</div>

<style>
	.control {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;

		height: 2.5rem;
		width: var(--width);
		max-width: 100%;
		padding: 2px 15px;
		margin: auto;

		border: 1px solid rgba(var(--light-c-rgb), 0.33);
		background: rgba(var(--light-b-rgb), 0.5);
		border-radius: 10px;

		font-size: 16px;

		pointer-events: all;
	}

	label {
		position: relative;
		display: flex;
		align-items: center;

		color: var(--dark-a);

		height: 100%;
		margin: auto 0;

		text-transform: lowercase;
		letter-spacing: 2px;
	}

	.range {
		width: 100%;
		padding: 18px 0;
	}
	.range.fullWidth {
		width: 85%;
	}
</style>
