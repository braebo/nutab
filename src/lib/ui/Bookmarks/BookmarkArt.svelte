<script lang="ts">
	import type { Bookmark } from '$lib/data/types'

	import { settings, bookmarkEditor } from '$lib/stores'
	import { mapRange } from 'fractils'

	export let bookmark: Bookmark = $bookmarkEditor

	$: longestWord =
		bookmark?.title?.split(' ').reduce((p: string, c: string) => {
			return c.length > p.length ? c : p
		}, '').length ?? 0
	$: fontSize = mapRange(Math.min(longestWord, 12), 6, 15, 17, 5)
	$: fontSizeScaled = (fontSize * $settings.ranges.iconSize.value) / 80

	$: backgroundImage = bookmark?.useImage ? `url(${bookmark?.image})` : 'none'
	$: backgroundColor = bookmark?.useImage ? `inherit` : bookmark?.background
	$: color = bookmark?.foreground
</script>

<div
	class="art"
	style="
		width: var(--size, {$settings.ranges.iconSize.value}px);
		height: var(--size, {$settings.ranges.iconSize.value}px);
		background-size: {bookmark?.autoImage ? 'cover' : 'contain'};
		background-image: {backgroundImage};
		background-color: {backgroundColor};
		color: {color};
	"
	style:font-size="{fontSizeScaled}px"
>
	{#if !bookmark.useImage}
		<span class="title">{@html bookmark.title}</span>
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
