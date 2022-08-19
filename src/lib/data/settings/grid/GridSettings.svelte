<script lang="ts">
	import { settings, showGuidelines } from '$lib/stores'
	import { blurOverlay } from '$lib/stores/blurOverlay'
	import ShowTitle from './ShowTitle.svelte'
	import Range from '$lib/ui/Range.svelte'
	import { fly } from 'svelte/transition'
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
		<div class="control" in:fly={{ y: 25, duration: 300, delay: 33 * i }} out:fly={{ y: 25, duration: 100 }}>
			<label for={setting}>{$settings.ranges[setting].label}</label>

			<div class="range">
				<Range
					on:input={(e) => handleInput(e, setting)}
					bind:value={$settings.ranges[setting].value}
					range={$settings.ranges[setting].range}
					name={setting}
				/>
			</div>
		</div>
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

	.control {
		display: flex;
		justify-content: space-between;
		align-items: center;

		height: 3.5rem;
		padding: 2px 15px;

		border: 1px solid rgba(var(--light-c-rgb), 0.33);
		background: rgba(var(--light-a-rgb), 0.25);
		border-radius: 10px;

		font-size: 16px;

		pointer-events: all;
	}

	label {
		position: relative;
		display: flex;
		align-items: center;

		color: var(--dark-d);

		width: max-content;
		height: 100%;
		margin: auto 0;
	}

	.range {
		width: 85%;
		padding: 18px 0;
	}

	.buttons {
		display: flex;
		justify-content: center;
		gap: 5rem;

		width: 100%;

		pointer-events: all;
	}
</style>
