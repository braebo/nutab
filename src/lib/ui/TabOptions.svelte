<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	export let options: string[]
	export let selected: number

	const handleClick = (option: typeof options[number], index: number) => {
		if (index !== selected) {
			selected = index

			dispatch('select', {
				option,
				index,
			})
		}
	}
</script>

<div class="tabs">
	{#each options as option, i}
		<div class="option" class:active={option === options[selected]} on:click={(e) => handleClick(option, i)}>
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
		border: 1px solid var(--light-b);
		border-bottom-color: var(--light-c);
		background: transparent;
		color: var(--light-d);

		overflow: hidden;
		transition: 0.25s;
	}

	.option {
		width: 100%;
		height: 100%;
		padding: 0.5rem;
		margin: 0;

		opacity: 0.5;
		background: var(--light-b);

		text-align: center;

		cursor: pointer;
		transition: 0.25s;

		&.active {
			opacity: 1;
			color: var(--dark-d);
			background: var(--light-a);
		}

		&:hover:not(.active) {
			opacity: 0.75;
			color: var(--dark-d);
			background: var(--light-b);
		}
	}

	.option:not(:last-of-type) {
		border-right: 1px solid var(--light-c);
	}
</style>
