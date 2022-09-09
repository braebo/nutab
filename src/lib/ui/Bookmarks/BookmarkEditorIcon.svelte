<script lang="ts">
	import { settings, bookmarkEditor } from '$lib/stores'
	import { mapRange } from 'fractils'

	$: longestWord =
		$bookmarkEditor?.title?.split(' ').reduce((p: string, c: string) => {
			return c.length > p.length ? c : p
		}, '').length ?? 0
	$: fontSize = mapRange(Math.min(longestWord, 12), 6, 15, 33, 5)
	$: fontSizeScaled = (fontSize * $settings.ranges.iconSize.value) / 80

	$: backgroundImage = $bookmarkEditor?.useImage ? `url(${$bookmarkEditor?.image})` : 'inherit'
	$: backgroundColor = $bookmarkEditor?.useImage ? `inherit` : $bookmarkEditor?.background

	$: color = $bookmarkEditor?.foreground

	$: imageStyle = `
		width: var(--size, ${$settings.ranges.iconSize.value}px);
		height: var(--size, ${$settings.ranges.iconSize.value}px);
		background-size: ${$bookmarkEditor?.autoImage ? 'cover' : 'contain'};
		background-image: ${backgroundImage};
		color: ${color};
	`
	$: colorStyle = `
		width: var(--size, ${$settings.ranges.iconSize.value}px);
		height: var(--size, ${$settings.ranges.iconSize.value}px);
		background-size: ${$bookmarkEditor?.autoImage ? 'cover' : 'contain'};
		background-color: ${backgroundColor};
		color: ${color};
	`
</script>

{#if $bookmarkEditor?.useImage}
	<div class="icon image" style={imageStyle} style:font-size="{fontSizeScaled}px">
		{#if $settings?.showTitle}
			<span class="title">{@html $bookmarkEditor?.title}</span>
		{/if}
	</div>
{:else}
	<div class="icon color" style={colorStyle} style:font-size="{fontSizeScaled}px">
		<span class="title">{@html $bookmarkEditor?.title}</span>
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
