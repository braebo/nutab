<script lang="ts">
	import { blurOverlay } from '$lib/stores/blurOverlay.svelte'
	import { settings } from '$lib/stores/settings.svelte'
	import { grid } from '$lib/stores/grid.svelte'
	import ShowTitle from './ShowTitle.svelte'
	import Range from '$lib/ui/Range.svelte'
	import { fly } from 'svelte/transition'
	import Control from './Control.svelte'
	import { onDestroy } from 'svelte'

	let timer: ReturnType<typeof setTimeout>
	function handleInput(_e: Event, setting: keyof typeof settings.ranges) {
		blurOverlay.value = true

		// Show and hide "guidelines" when gridwidth changes
		if (setting === 'gridWidth') grid.showGuidelines = true

		clearTimeout(timer)

		timer = setTimeout(() => {
			cleanup()
		}, 1000)
	}

	onDestroy(() => {
		clearTimeout(timer)
		cleanup()
	})

	function cleanup() {
		blurOverlay.value = false
		grid.showGuidelines = false
	}

	const settingsKeys = $derived(
		Object.keys(settings.ranges).filter((s) =>
			['gridWidth', 'gridGap', 'iconSize'].includes(s),
		) as Array<keyof typeof settings.ranges>,
	)

	const ranges = {
		gridWidth: { label: 'Width', range: { min: 500, max: 2000 } },
		iconSize: { label: 'Icon', range: { min: 32, max: 90 } },
		gridGap: { label: 'Spacing', range: { min: 0, max: 100 } },
	}
</script>

<div class="controls">
	{#each settingsKeys as setting, i}
		<Control label={ranges[setting].label} {i}>
			<Range
				oninput={(e) => handleInput(e, setting)}
				bind:value={settings.ranges[setting]}
				range={ranges[setting].range}
				name={setting}
			/>
		</Control>
	{/each}

	<div
		class="show-title"
		in:fly={{ y: 10, duration: 200, delay: 50 * Object.keys(settings.ranges).length }}
		out:fly={{ y: 15, duration: 100 }}
	>
		<ShowTitle />
	</div>
</div>

<style>
	.controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		width: 75%;
		margin: 0 auto;
	}

	.show-title {
		display: flex;
		justify-content: center;

		margin-top: 2rem;
		width: 100%;

		pointer-events: all;
	}
</style>
