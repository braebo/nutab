<script lang="ts">
	import SyncSettings from './sync/SyncSettings.svelte'
	import ThemeSettings from './theme/ThemeSettings.svelte'
	import GridSettings from './grid/GridSettings.svelte'
	import FluidPanel from './FluidPanel.svelte'
	import { fly, fade } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'

	const sections = {
		grid: GridSettings,
		theme: ThemeSettings,
		sync: SyncSettings,
	}

	let activeSection: (typeof sections)[keyof typeof sections] = $state(sections['grid'])
</script>

<FluidPanel>
	{@const SvelteComponent = activeSection}
	<div class="control-panel">
		<nav>
			{#each Object.entries(sections) as [title, component]}
				<div
					class:active={activeSection === component}
					onclick={() => (activeSection = component)}
					in:fly|global={{ y: 5, duration: 500, delay: 150, easing: quintOut }}
					out:fade={{ duration: 50 }}
				>
					{title}
				</div>
			{/each}
		</nav>

		{#key activeSection}
			<div
				class="settings-section-component"
				in:fly|global={{ y: 5, duration: 500, delay: 200, easing: quintOut }}
			>
				{#key activeSection}
					<SvelteComponent />
				{/key}
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
		height: 3.5rem;
		gap: 1rem;

		color: var(--bg-a);

		div {
			font-variation-settings: 'wght' 100;
			font-family: var(--font-a);
			text-transform: uppercase;
			letter-spacing: 3px;
			font-size: 1.2rem;
			font-variation-settings: 'wght' 100;

			width: 100px;
			text-align: center;

			opacity: 0.5;
			cursor: pointer;
			user-select: none;

			transition: 0.2s;

			&.active {
				opacity: 1;
				font-variation-settings: 'wght' 500;
			}
			&:hover {
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
