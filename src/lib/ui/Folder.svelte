<script lang="ts">
	import SettingsPanel from '../settings/SettingsPanel.svelte'
	import { addDefaultFolder } from '../data/transactions'
	import { settings } from '../settings/settingsStore'
	import { activeFolder } from '../data/dbStore'
	import Bookmark from './Bookmark.svelte'

	import { createEventDispatcher, onMount } from 'svelte'
	import Tooltip from './Tooltip.svelte'

	const dispatch = createEventDispatcher()

	let hovering: number | null = null

	onMount(() => addDefaultFolder())
</script>

<div class="folder-container">
	{#if $activeFolder?.bookmarks}
		{#each $activeFolder.bookmarks as bookmark, i}
			<!-- prettier-ignore -->
			<div
				class="bookmark-container"
				style="
					width: {$settings.ranges.cellSize.value}px;
					height: {$settings.ranges.iconSize.value}px;
					margin: {$settings.ranges.gridGap.value}px;
				"
                on:mouseover={() => hovering = i}
                on:mouseout={() => hovering = null}
                on:focus={() => hovering = i}
                on:blur={() => hovering = null}
			>
				<Bookmark {bookmark} {hovering} {i} on:showEditor/>
			</div>
		{/each}
	{/if}
	<div class="add-bookmark" on:click={() => dispatch('newBookmark')}>
		<Tooltip content="New_Bookmark" placement="bottom" offset={[0, 10]}>+</Tooltip>
	</div>
</div>

<SettingsPanel />

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

		font-size: 3rem;

		color: var(--dark-a);
		opacity: 0.1;

		cursor: pointer;
		transition: opacity 0.15s;

		&:hover {
			opacity: 0.75;

			transition: opacity 0.4s;
		}
	}
</style>
