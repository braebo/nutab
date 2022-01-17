<script>
	import { settings } from '$lib/data/settings/settingsStore'
	import { fly } from 'svelte/transition'
</script>

<label for="showTitle">
	<!-- <input type="checkbox" bind:checked={$settings.showTitle} /> -->
	<div class="title-toggle" on:click={() => ($settings.showTitle = !$settings.showTitle)}>
		{#key $settings.showTitle}
			<div class="show-hide" in:fly={{ y: 30 }} out:fly={{ y: -30 }}>
				{$settings.showTitle ? 'Hide' : 'Show'}
			</div>
		{/key}
		<div class="titles">Titles</div>
	</div>
</label>

<style lang="scss">
	.title-toggle {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;

		width: 120px;
		height: 15px;
		margin: auto;
		padding: 1rem 2rem;

		border-radius: 10px;
		background: var(--light-a);
		border: 1px solid var(--light-a);

		font-family: var(--font);

		cursor: pointer;
		user-select: none;
		overflow: hidden;

		transition: 150ms;

		&:hover {
			border: 1px solid var(--light-c);
		}

		.show-hide {
			position: absolute;
			inset: 0;
			left: -40%;

			width: max-content;
			height: max-content;
			margin: auto;

			white-space: nowrap;
		}

		.titles {
			transform: translateX(50%);
		}
	}
</style>
