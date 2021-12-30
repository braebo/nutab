<script lang="ts">
	// Data
	import { settings } from '$lib/settings/settingsStore'
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

<div class="folder-container">
	{#if $activeFolder?.bookmarks}
		{#each $activeFolder.bookmarks as bookmark, i}
			<div
				class="bookmark-container"
				style="
					width: {$settings.ranges.cellSize.value}px;
					height: {$settings.ranges.iconSize.value}px;
					margin: {$settings.ranges.gridGap.value}px;
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
	.bookmark-container {
		display: flex;

		width: max-content;
	}

	.folder-container {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;

		width: max-content;
		max-width: 80vw;
		margin: 0 auto;
		margin-top: 5%;
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
