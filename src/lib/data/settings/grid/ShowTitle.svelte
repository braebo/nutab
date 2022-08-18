<script>
	import { fly } from 'svelte/transition'
	import { settings } from '$lib/stores'
</script>

<label for="showTitle">
	<!-- <input type="checkbox" bind:checked={$settings.showTitle} /> -->
	<div class="btn title-toggle" on:click={() => ($settings.showTitle = !$settings.showTitle)}>
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
		width: 110px;

		color: var(--dark-d);
		background-color: var(--light-a);

		user-select: none;
		overflow: hidden;

		transition: 150ms;

		&:hover {
			border: 1px solid var(--light-c);
		}

		.show-hide {
			position: absolute;
			inset: 0;
			left: -42%;

			width: max-content;
			height: max-content;
			margin: auto;

			white-space: nowrap;
		}

		.titles {
			transform: translateX(55%);
		}
	}
</style>
