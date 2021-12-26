<script lang="ts">
	import SettingsPanel from '../settings/SettingsPanel.svelte'
	import { addDefaultCollection } from '../data/transactions'
	import { settings } from '../settings/settingsStore'
	import { activeCollection } from '../data/dbStore'
	import Bookmark from './Bookmark.svelte'

	import { onMount } from 'svelte'

	let hovering: number | null = null

	onMount(() => addDefaultCollection())
</script>

<div class="collection-container">
	{#if $activeCollection?.bookmarks}
		{#each $activeCollection.bookmarks as bookmark, i}
			<!-- prettier-ignore -->
			<div
				class="bookmark-container"
				style="
					width: {$settings.ranges.iconSize.value}px;
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
</div>

<SettingsPanel />

<style>
	.bookmark-container {
		display: flex;

		width: max-content;
	}
	.collection-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;

		width: max-content;
		max-width: 80vw;
		margin: 0 auto;
		margin-top: 5%;
		contain: none;
	}
</style>
