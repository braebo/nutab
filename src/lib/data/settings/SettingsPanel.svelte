<script lang="ts">
	import { settings, showSettings, showGuidelines } from './settingsStore'
	import RandomizeBackground from './RandomizeBackground.svelte'
	import { clickOutside } from '$lib/utils/clickOutside'
	import ShowTitle from './ShowTitle.svelte'
	import Range from '$lib/ui/Range.svelte'
	import { fly } from 'svelte/transition'
	import Lock from '$lib/graphics/Lock.svelte'

	let sgTimer: NodeJS.Timeout
	const toggleShowGuidelines = (e: Event, setting: any) => {
		if (setting != 'gridWidth') return
		clearTimeout(sgTimer)
		$showGuidelines = true
		sgTimer = setTimeout(() => {
			$showGuidelines = false
		}, 1000)
	}
</script>

<div class="mousetrap" on:mouseover={() => ($showSettings = true)} on:focus={() => ($showSettings = true)} />

{#if $showSettings}
	<div
		class="control-panel"
		transition:fly={{ y: 500, opacity: 1, duration: 300 }}
		on:click_outside={() => ($showSettings = false)}
		use:clickOutside
	>
		<div class="controls">
			{#each Object.keys($settings.ranges) as setting}
				<div class="control">
					<label for={setting}>{$settings.ranges[setting].label}</label>
					<Range
						range={$settings.ranges[setting].range}
						bind:setting={$settings.ranges[setting].value}
						on:input={(e) => toggleShowGuidelines(e, setting)}
						name={setting}
					/>
				</div>
			{/each}
			<div class="buttons">
				<ShowTitle />
				<div class="background">
					<RandomizeBackground />
					<Lock />
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.control-panel {
		position: absolute;
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;

		width: 600px;
		max-width: 100vw;
		height: 400px;
		margin: auto;

		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
		background: rgba(var(--light-b-rgb), 0.4);
		color: var(--dark-a);
		box-shadow: 0 10px 50px 0px rgba(29, 29, 29, 0.04), 0 6px 20px 5px rgba(29, 29, 29, 0.01);
		backdrop-filter: blur(50px);

		z-index: 50;
	}

	.controls {
		height: 200px;
		width: 75%;
		margin: auto;
		margin-top: 50px;
	}

	.control {
		display: flex;
		justify-content: space-between;

		height: max-content;
		margin: 20px 0;
		padding: 2px 15px;

		border: 1px solid rgba(var(--light-c-rgb), 0.33);
		border-radius: 10px;
		background: rgba(var(--light-a-rgb), 0.33);

		font-size: 20px;
	}

	label {
		position: relative;

		width: max-content;
		height: 100%;
		margin: auto 0;
	}

	.mousetrap {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;

		width: 100px;
		height: 50px;
		margin: auto;

		z-index: 40;
	}

	.buttons {
		display: flex;
		justify-content: center;
		gap: 5rem;

		width: 100%;
	}

	.background {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
