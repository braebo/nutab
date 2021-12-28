<script>
	import { settings } from '$lib/settings/settingsStore'

	export let title = '🔗'
</script>

<div
	class="art"
	style="width: var(--size, {$settings.ranges.iconSize.value}px); height: var(--size, {$settings
		.ranges.iconSize.value}px);"
>
	{@html title}
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

		word-break: break-all;
		text-align: center;

		overflow: hidden;
	}
</style>
