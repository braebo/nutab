<script lang="ts">
	// Data
	import { showGuidelines } from '$lib/data/settings/settingsStore'
	import { grid, gridDimensions } from '$lib/stores/gridStore'
	import { activeFolder } from '$lib/data/dbStore'
	import { initDB } from '$lib/data/transactions'

	// Components
	import Tooltip from '$lib/ui/Tooltip.svelte'
	import Bookmark from './Bookmark.svelte'

	// Utils
	import { onMount, createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	let hovering: number | null = null

	onMount(() => initDB())
</script>

<div class="grid" style="width: {$grid.gridWidth}px;" class:showGuidelines={$showGuidelines}>
	{#if $activeFolder?.bookmarks}
		{#each $activeFolder.bookmarks as bookmark, i}
			<div
				class="grid-item"
				style="
					width: {$grid.iconSize}px;
					height: {$grid.iconSize}px;
					margin: {$grid.gridGap}px;
				"
				on:mouseover={() => (hovering = i)}
				on:mouseout={() => (hovering = null)}
				on:focus={() => (hovering = i)}
				on:blur={() => (hovering = null)}
			>
				<Bookmark {bookmark} {hovering} {i} on:showEditor />
			</div>
		{/each}
	{/if}
	<div class="add-bookmark" on:click={() => dispatch('newBookmark')}>
		<Tooltip content="New_Bookmark" placement="bottom" offset={[0, 10]}>+</Tooltip>
	</div>
</div>

<style lang="scss">
	.grid {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;

		width: max-content;
		max-width: 80vw;
		margin: 0 auto;
		margin-top: 5%;

		// for $showGuidelines
		border: 1px solid #0000;
		border-top: none;
		border-bottom: none;

		transition: border 0.2s ease-in-out;
	}
	.showGuidelines {
		border: 1px solid rgba(var(--dark-d-rgb), 0.5);
		border-top: none;
		border-bottom: none;
	}

	.add-bookmark {
		position: absolute;
		left: 0;
		right: 0;
		bottom: -7rem;

		width: fit-content;
		margin: auto;

		color: var(--dark-a);
		opacity: 0.1;

		font-size: 3rem;

		cursor: pointer;
		transition: opacity 0.15s;

		&:hover {
			opacity: 0.75;

			transition: opacity 0.4s;
		}
	}
</style>
