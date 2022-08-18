<script lang="ts">
	import ThemeSettings from './theme/ThemeSettings.svelte'
	import GridSettings from './grid/GridSettings.svelte'
	import FluidPanel from './FluidPanel.svelte'

	const sections = {
		grid: GridSettings,
		theme: ThemeSettings,
	}

	let activeSection: typeof sections[keyof typeof sections] = sections['grid']
</script>

<FluidPanel>
	<div class="control-panel">
		<nav>
			{#each Object.entries(sections) as [section, component]}
				<div
					role="link"
					class:active={activeSection === component}
					on:click={() => (activeSection = component)}
				>
					{section}
				</div>
			{/each}
		</nav>
		{#key activeSection}
			<div class="settings-section-component">
				<svelte:component this={activeSection} />
			</div>
		{/key}
	</div>
</FluidPanel>

<style lang="scss">
	.control-panel {
		display: flex;
		flex-direction: column;
		position: relative;

		min-width: 100%;
		min-height: 100%;

		z-index: 50;
		pointer-events: all;
	}

	nav {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		height: 4rem;
		gap: 3rem;

		font-variation-settings: 'wght' 100;
		font-family: var(--font-a);
		text-transform: uppercase;
		letter-spacing: 3px;
		font-size: 1.2rem;
		font-weight: 100;

		div {
			opacity: 0.5;
			cursor: pointer;
			user-select: none;

			&.active {
				opacity: 1;
			}
		}
	}

	.settings-section-component {
		position: absolute;
		inset: 0;
		width: 100%;
		top: 6.5rem;
	}
</style>
