<script lang="ts">
	import { settings, gradientBackground } from '$lib/stores'

	const updateBg = (e: Event) => ($settings.background = $gradientBackground)
</script>

<div class="gradient-editor">
	<input
		disabled={!$settings.lockBackground}
		class="a"
		type="color"
		bind:value={$settings.gradientA}
		on:input={updateBg}
	/>
	<input
		disabled={!$settings.lockBackground}
		class="b"
		type="color"
		bind:value={$settings.gradientB}
		on:input={updateBg}
	/>
</div>

<style lang="scss">
	.gradient-editor {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	input {
		$size: 5rem;
		width: $size;
		height: $size/2;
		border: none;
		border-radius: 0.25rem;
		background-color: var(--light-a);

		&:disabled {
			opacity: 0.25;
		}
	}
</style>
