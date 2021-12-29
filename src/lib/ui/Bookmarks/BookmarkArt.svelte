<script lang="ts">
	import { settings } from '$lib/settings/settingsStore'
	import { mapRange } from 'fractils'

	export let title = '🔗'

	$: longestWord = title.split(' ').reduce((p: string[], c: string[]) => {
		return c.length > p.length ? c : p
	}, []).length
	$: fontSize = mapRange(Math.min(longestWord, 12), 6, 12, 20, 14)
</script>

<div
	class="art"
	style="
		width: var(--size, {$settings.ranges.iconSize.value}px);
		height: var(--size, {$settings.ranges.iconSize.value}px);
		
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

		margin: 2rem auto;
		padding: 0.5rem;

		color: var(--foreground);
		background: var(--background);
		border-radius: 10px;
		box-shadow: 0px 4.7px 10px -3px rgba(0, 0, 0, 0.275),
			0px 7.3px 5.6px -1px rgba(0, 0, 0, 0.09), 0px 14px 15px -1px rgba(0, 0, 0, 0.14);

		text-align: center;

		overflow: hidden;
	}
	.title {
		font-weight: 700;
	}
</style>
