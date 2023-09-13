<script>
	import { fly } from 'svelte/transition'
	import { settings } from '$lib/stores'
</script>

<label for="showTitle">
	<!-- <input type="checkbox" bind:checked={$settings.showTitle} /> -->
	<div class="btn" on:click={() => ($settings.showTitle = !$settings.showTitle)}>
		{#key $settings.showTitle}
			<div class="show-hide" in:fly|global={{ y: 30 }} out:fly|global={{ y: -30 }}>
				{$settings.showTitle ? 'Hide' : 'Show'}
			</div>
		{/key}
		<div class="titles">Titles</div>
	</div>
</label>

<style lang="scss">
	.btn {
		width: 110px;

		user-select: none;
		overflow: hidden;

		transition: 150ms;

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
