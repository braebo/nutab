<script lang="ts">
	import { settings, type Settings } from '$lib/stores'

	import ShuffleBackground from './RandomizeBackground.svelte'
	import GradientEditor from './GradientEditor.svelte'
	import TabOptions from '$lib/ui/TabOptions.svelte'
	import Saturation from './Saturation.svelte'
	import { fly } from 'svelte/transition'

	export let thisTheme: keyof Settings['theme']

	let selected = $settings.theme[thisTheme].lockBackground ? 1 : 0

	export const toggleMode = (e: CustomEvent) => {
		$settings.theme[thisTheme].lockBackground = !!e.detail.index
	}

	$: custom = $settings.theme[thisTheme].lockBackground

	const direction = thisTheme === 'dark' ? 1 : -1

	const shared = thisTheme === 'shared'
	const dark = thisTheme === 'dark'
	const gradientIn = shared ? { y: 5 } : { x: 5 }
</script>

<div class="theme-settings">
	<div class="row" class:dark class:shared>
		<div class="col">
			<div class="tabs">
				<TabOptions options={['Random', 'Custom']} bind:selected on:select={toggleMode} />
			</div>
			<div class="controls">
				<Saturation {thisTheme} />
				{#if !custom}
					<div class="randomize-btn">
						<div
							class:shared
							class="shuffle-bg"
							in:fly|local={{ y: 10, duration: 250, delay: 200 }}
							out:fly|local={{ y: 10, duration: 250 }}
						>
							<ShuffleBackground {thisTheme} />
						</div>
					</div>
				{/if}
			</div>
		</div>
		{#if custom}
			<div
				class="color-pickers"
				class:shared
				in:fly={{ ...gradientIn, duration: 150, delay: 250 }}
				out:fly|local={{ x: 5 * direction, duration: 10 }}
			>
				<GradientEditor {thisTheme} />
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.theme-settings {
		display: flex;
		flex-direction: column;
		align-items: center;

		height: 78%;
		width: 100%;
	}

	.row {
		display: flex;
		flex-direction: row-reverse;

		height: 100%;
		width: 80%;
		margin-right: 30%;

		&.dark {
			flex-direction: row;
			margin-right: unset;
			margin-left: 30%;
		}

		&.shared {
			align-items: center;
			margin: unset;
			flex-direction: column;
			height: 16rem;
		}
	}

	.col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		height: 100%;
		width: 70%;
	}

	.shuffle-bg.shared {
		margin-top: 6rem;
	}

	.color-pickers {
		margin: 1rem;

		&.shared {
			margin: 0rem;
			transform: scale(1.25);
		}
	}

	.tabs {
		width: 100%;
	}

	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		width: 100%;

		:global(.control) {
			width: 100%;
		}
	}

	.randomize-btn {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;

		height: 4rem;
		width: 7.5rem;

		div {
			position: absolute;
		}
	}
</style>
