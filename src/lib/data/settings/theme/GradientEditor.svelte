<script lang="ts">
	import type { Settings } from '$lib/data/types'
	import { settings } from '$lib/stores/settings.svelte'
	import { createGradient } from '$lib/theme_og'

	interface Props {
		thisTheme: keyof Settings['theme']
	}

	let { thisTheme }: Props = $props()

	const updateBg = (_e: Event) => {
		settings.theme[thisTheme].background = createGradient(thisTheme)
	}
</script>

<div class="gradient-editor">
	<div class="picker">
		<input
			disabled={!settings.theme[thisTheme].lockBackground}
			class="a"
			type="color"
			bind:value={settings.theme[thisTheme].gradientA}
			oninput={updateBg}
		/>
	</div>
	<div class="picker">
		<input
			disabled={!settings.theme[thisTheme].lockBackground}
			class="b"
			type="color"
			bind:value={settings.theme[thisTheme].gradientB}
			oninput={updateBg}
		/>
	</div>
</div>

<style lang="scss">
	.gradient-editor {
		display: flex;
		flex-direction: column;
		align-items: center;

		gap: 1rem;
	}

	.picker {
		display: flex;
		flex-direction: column;
		align-items: center;

		$size: 1.5rem;
		max-width: $size;
		max-height: $size;

		border-radius: 100%;

		overflow: hidden;
	}

	input {
		$size: 2rem;
		width: $size;
		height: $size;
		border: none;
		padding: 0;

		transform: scale(2);

		cursor: pointer;

		&:disabled {
			opacity: 0.25;
			cursor: not-allowed;
		}
	}
</style>
