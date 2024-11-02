<script lang="ts">
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	import { blurOverlay } from '$lib/stores/blurOverlay.svelte'
	import { settings } from '$lib/stores/settings.svelte'

	let blur = $derived(
		bookmarkEditor.showFolderEditor || bookmarkEditor.showBookmarkEditor || blurOverlay.value,
	)

	let unblurBookmarks = $derived(!settings.showSettings)
</script>

<div class:blur class:unblurBookmarks></div>

<style lang="scss">
	div {
		position: fixed;
		bottom: 0;

		backface-visibility: hidden;

		height: 100%;
		width: 100%;

		transition: 0.3s;
		pointer-events: none;
		z-index: 4;
	}

	.blur {
		background: color-mix(in srgb, var(--fg-a) 10%, transparent);
		backdrop-filter: saturate(0) contrast(1.05);
		z-index: 2;
	}

	.unblurBookmarks {
		z-index: 2;
	}
</style>
