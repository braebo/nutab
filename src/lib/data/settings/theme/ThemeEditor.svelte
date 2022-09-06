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
</script>

<div class="theme-settings">
	<div class="tabs">
		<TabOptions options={['Random', 'Locked']} bind:selected on:select={toggleMode} />
	</div>
	<div class="controls">
		<Saturation {thisTheme} />
		<div class="transition">
			{#if $settings.theme[thisTheme].lockBackground}
				<div in:fly={{ y: 10, duration: 350, delay: 150 }} out:fly={{ y: 10, duration: 350 }}>
					<GradientEditor {thisTheme} />
				</div>
			{:else}
				<div in:fly={{ y: 10, duration: 350, delay: 150 }} out:fly={{ y: 10, duration: 350 }}>
					<ShuffleBackground {thisTheme} />
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.theme-settings {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		height: 90%;
		width: 100%;
	}

	.tabs {
		width: 50%;
	}

	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;

		width: 81%;
	}

	.transition {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;

		height: 100px;
		width: 7.5rem;

		div {
			position: absolute;
		}
	}
</style>
