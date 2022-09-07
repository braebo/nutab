<script lang="ts">
	import type { Settings } from '$lib/stores/settingsStore'
	import { settings } from '$lib/stores'
	import { createGradient } from '$lib/theme'

	export let thisTheme: keyof Settings['theme']

	const updateBg = (e: Event) => {
		$settings.theme[thisTheme].background = createGradient(thisTheme)
	}
</script>

<div class="gradient-editor">
	<input
		disabled={!$settings.theme[thisTheme].lockBackground}
		class="a"
		type="color"
		bind:value={$settings.theme[thisTheme].gradientA}
		on:input={updateBg}
	/>
	<input
		disabled={!$settings.theme[thisTheme].lockBackground}
		class="b"
		type="color"
		bind:value={$settings.theme[thisTheme].gradientB}
		on:input={updateBg}
	/>
</div>

<style lang="scss">
	.gradient-editor {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	input {
		$size: 5rem;
		width: $size;
		height: calc($size / 2);
		border: none;
		border-radius: 0.25rem;
		background-color: var(--light-a);
		padding: 0;

		cursor: pointer;

		&:disabled {
			opacity: 0.25;
			cursor: not-allowed;
		}
	}
</style>
