<script lang="ts">
	import { settings, bookmarkEditor } from '$lib/stores'
	import { mapRange } from 'fractils'

	export let title = '🔗'

	$: longestWord =
		title?.split(' ').reduce((p: string, c: string) => {
			return c.length > p.length ? c : p
		}, '').length ?? 0

	$: fontSize = mapRange(Math.min(longestWord, 12), 6, 12, 20, 5)
	$: fontSizeScaled = (fontSize * $settings.ranges.iconSize.value) / 80
</script>

<div
	class="art"
	style="
		width: var(--size, {$settings.ranges.iconSize.value}px);
		height: var(--size, {$settings.ranges.iconSize.value}px);
		{$bookmarkEditor?.image ? `background-image: url(${$bookmarkEditor?.image});` : ''}
	"
	style:font-size="{fontSizeScaled}px"
>
	{#if !$bookmarkEditor?.useImage}
		<span class="title">{@html title}</span>
	{/if}
</div>

<style>
	.art {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;

		/* margin: var(--margin); */
		padding: 0.2rem;
		/* margin-bottom: -0.25rem; */

		color: var(--foreground);
		border-radius: 10px;
		background: var(--background);
		box-shadow: var(--shadow);

		background-image: var(--background);
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;

		text-align: center;

		overflow: hidden;
	}
	.title {
		font-weight: 500;
		word-wrap: break-word;
		overflow: hidden;
	}
</style>
