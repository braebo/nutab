<script lang="ts">
	import { settings } from '$lib/data/settings/settingsStore'
	import { mapRange } from 'fractils'

	export let title = '🔗'

	$: longestWord = title.split(' ').reduce((p: string, c: string) => {
		return c.length > p.length ? c : p
	}, '').length

	$: fontSize = mapRange(Math.min(longestWord, 12), 6, 12, 20, 5)
	$: fontSizeScaled = (fontSize * $settings.ranges.iconSize.value) / 80
</script>

<div
	class="art"
	style="
		width: var(--size, {$settings.ranges.iconSize.value}px);
		min-height: var(--size, {$settings.ranges.iconSize.value}px);
	"
	style:font-size="{fontSizeScaled}px"
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
		padding: 0.2rem;
		margin-bottom: -0.25rem;

		color: var(--foreground);
		background: var(--background);
		border-radius: 10px;
		box-shadow: var(--shadow);

		background-repeat: no-repeat;
		background-size: cover;

		text-align: center;

		overflow: hidden;
	}
	.title {
		font-weight: 500;
		word-wrap: break-word;
		overflow: hidden;
	}
</style>
