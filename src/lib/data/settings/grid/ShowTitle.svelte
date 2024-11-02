<script lang="ts">
	import { settings } from '$lib/stores/settings.svelte'
	import { fly } from 'svelte/transition'
</script>

<label for="showTitle">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="btn"
		onclick={() => (settings.showTitle = !settings.showTitle)}
		role="button"
		tabindex="0"
	>
		{#key settings.showTitle}
			<div class="show-hide" in:fly={{ y: 30 }} out:fly={{ y: -30 }}>
				{settings.showTitle ? 'Hide' : 'Show'}
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
