<script lang="ts">
	import { settings } from '$lib/data/settings/settingsStore'
	import { mapRange } from 'fractils'

	export let title = '🔗'

	$: longestWord = title.split(' ').reduce((p: string, c: string) => {
		return c.length > p.length ? c : p
	}, '').length
	$: fontSize = mapRange(Math.min(longestWord, 12), 6, 12, 20, 14)
</script>

<div
	class="art"
	style="
		width: var(--size, {$settings.ranges.iconSize.value}px);
		min-height: var(--size, {$settings.ranges.iconSize.value}px);

		font-size: var(--font-size, {fontSize}px);
	"
>
	<span class="title">{@html title}</span>
</div>

<style>
	.art {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;

		margin: var(--margin, auto);
		padding: 0.5rem;
		margin-bottom: -0.25rem;

		color: var(--foreground);
		background: var(--background);
		border-radius: 10px;
		box-shadow: var(--shadow);

		text-align: center;

		overflow: hidden;
	}
	.title {
		font-weight: 500;
	}
</style>
