<script>
	import { settings } from '$lib/settings/settingsStore'

	export let title = '🔗'
</script>

<div
	class="art"
	style="width: var(--size, {$settings.ranges.iconSize.value}px); height: var(--size, {$settings
		.ranges.iconSize.value}px);"
>
	{@html title == '' || title == 'title' ? '🔗' : title}
</div>

<style>
	.art {
		display: flex;
		justify-content: center;
		align-items: center;

		margin: 2rem auto;

		color: var(--foreground);
		background: var(--background);
		border-radius: 10px;
	}
</style>
