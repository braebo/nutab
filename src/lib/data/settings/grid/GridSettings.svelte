<script lang="ts">
	import { settings, showGuidelines } from '$lib/stores'
	import { blurOverlay } from '$lib/stores/blurOverlay'
	import ShowTitle from './ShowTitle.svelte'
	import Range from '$lib/ui/Range.svelte'
	import { fly } from 'svelte/transition'
	import Control from './Control.svelte'
	import { onDestroy } from 'svelte'

	let timer: NodeJS.Timeout
	function handleInput(e: Event, setting: string) {
		$blurOverlay = true

		// Show and hide "guidelines" when gridwidth changes
		if (setting === 'gridWidth') $showGuidelines = true

		clearTimeout(timer)

		timer = setTimeout(() => {
			$blurOverlay = false
			$showGuidelines = false
		}, 1000)
	}

	onDestroy(() => {
		clearTimeout(timer)
		$blurOverlay = false
		$showGuidelines = false
	})
</script>

<div class="controls">
	{#each Object.keys($settings.ranges).filter((s) => ['gridWidth', 'gridGap', 'iconSize'].includes(s)) as setting, i}
		<Control label={$settings.ranges[setting].label} {i}>
			<Range
				on:input={(e) => handleInput(e, setting)}
				bind:value={$settings.ranges[setting].value}
				range={$settings.ranges[setting].range}
				name={setting}
			/>
		</Control>
	{/each}

	<div
		class="buttons"
		in:fly={{ y: 10, duration: 300, delay: 50 * Object.keys($settings.ranges).length }}
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

	.buttons {
		display: flex;
		justify-content: center;
		gap: 5rem;

		width: 100%;

		pointer-events: all;
	}
</style>
