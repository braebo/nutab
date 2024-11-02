<script lang="ts">
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	import { settings } from '$lib/stores/settings.svelte'
	import { mapRange } from 'fractils'

	let longestWord = $derived(
		bookmarkEditor.editor?.title?.split(' ').reduce((p: string, c: string) => {
			return c.length > p.length ? c : p
		}, '').length ?? 0,
	)
	let fontSize = $derived(mapRange(Math.min(longestWord, 12), 6, 15, 33, 5))
	let fontSizeScaled = $derived((fontSize * settings.ranges.iconSize) / 80)

	let backgroundImage = $derived(
		bookmarkEditor.editor?.useImage ? `url(${bookmarkEditor.editor?.image})` : 'inherit',
	)
	let backgroundColor = $derived(
		bookmarkEditor.editor?.useImage ? `inherit` : bookmarkEditor.editor?.background,
	)

	let color = $derived(bookmarkEditor.editor?.foreground)

	let imageStyle = $derived(`
		width: var(--size, ${settings.ranges.iconSize}px);
		height: var(--size, ${settings.ranges.iconSize}px);
		background-size: ${bookmarkEditor.editor?.autoImage ? 'cover' : 'contain'};
		background-image: ${backgroundImage};
		color: ${color};
	`)
	let colorStyle = $derived(`
		width: var(--size, ${settings.ranges.iconSize}px);
		height: var(--size, ${settings.ranges.iconSize}px);
		background-size: ${bookmarkEditor.editor?.autoImage ? 'cover' : 'contain'};
		background-color: ${backgroundColor};
		color: ${color};
	`)
</script>

{#if bookmarkEditor.editor?.useImage}
	<div class="icon image" style={imageStyle} style:font-size="{fontSizeScaled}px">
		{#if settings?.showTitle}
			<span class="title">{@html bookmarkEditor.editor?.title}</span>
		{/if}
	</div>
{:else}
	<div class="icon color" style={colorStyle} style:font-size="{fontSizeScaled}px">
		<span class="title">{@html bookmarkEditor.editor?.title}</span>
	</div>
{/if}

<style>
	.icon {
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
