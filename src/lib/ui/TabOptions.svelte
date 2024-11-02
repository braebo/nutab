<script lang="ts">
	let {
		options,
		selected = $bindable(),
		onSelect = () => void 0,
	}: {
		options: string[]
		selected: number
		onSelect: (e: { option: (typeof options)[number]; index: number }) => void
	} = $props()

	const handleClick = (option: (typeof options)[number], index: number) => {
		if (index !== selected) {
			selected = index

			onSelect?.({
				option,
				index,
			})
		}
	}
</script>

<div class="tabs">
	{#each options as option, i}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="option"
			class:active={option === options[selected]}
			onclick={() => handleClick(option, i)}
			role="button"
			tabindex="0"
		>
			{option}
		</div>
	{/each}
</div>

<style lang="scss">
	.tabs {
		display: flex;
		align-items: center;
		justify-content: center;

		width: 100%;
		padding: 0;
		margin: 0;

		border-radius: var(--radius);
		border: 1px solid var(--fg-b);
		border-bottom-color: var(--fg-c);
		background: transparent;
		color: var(--fg-d);

		overflow: hidden;
		transition: 0.05s;
	}

	.option {
		width: 100%;
		height: 100%;
		padding: 0.5rem;
		margin: 0;

		opacity: 0.5;
		background: var(--fg-b);

		text-align: center;

		cursor: pointer;
		transition: 0.05s;

		&.active {
			opacity: 1;
			color: var(--bg-a);
			background: var(--fg-a);
			cursor: default;
		}

		&:hover:not(.active) {
			opacity: 1;
			color: var(--bg-d);
			background: var(--fg-b);
		}
	}

	.option:not(:last-of-type) {
		border-right: 1px solid var(--fg-c);
	}
</style>
