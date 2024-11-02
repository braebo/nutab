<script lang="ts">
	import type { Bookmark } from '$lib/data/types'

	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	import { settings } from '$lib/stores/settings.svelte'
	import { mapRange } from 'fractils'

	let {
		bookmark = $bindable(bookmarkEditor.editor),
	}: {
		bookmark?: Bookmark | null
	} = $props()

	let longestWord = $derived(
		bookmark?.title?.split(' ').reduce((p: string, c: string) => {
			return c.length > p.length ? c : p
		}, '').length ?? 0,
	)
	let fontSize = $derived(mapRange(Math.min(longestWord, 12), 6, 15, 17, 5))
	let fontSizeScaled = $derived((fontSize * settings.ranges.iconSize) / 80)

	let backgroundImage = $derived(bookmark?.useImage ? `url(${bookmark?.image})` : 'none')
	let backgroundColor = $derived(bookmark?.useImage ? `inherit` : bookmark?.background)
	let color = $derived(bookmark?.foreground)
</script>

<div
	class="art"
	style="
		width: var(--size, {settings.ranges.iconSize}px);
		height: var(--size, {settings.ranges.iconSize}px);
		background-size: {bookmark?.autoImage ? 'cover' : 'contain'};
		background-image: {backgroundImage};
		background-color: {backgroundColor};
		color: {color};
	"
	style:font-size="{fontSizeScaled}px"
>
	{#if !bookmark?.useImage}
		<span class="title">{@html bookmark?.title}</span>
	{/if}
</div>

<style>
	.art {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;

		border-radius: 10px;
		box-shadow: var(--shadow);

		background-repeat: no-repeat;
		background-position: center;

		text-align: center;

		overflow: hidden;
	}
	.title {
		padding: 5px;
		font-weight: 500;
		word-wrap: break-word;
		overflow: hidden;
	}
</style>
