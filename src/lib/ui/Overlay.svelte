<script lang="ts">
	import { showBookmarkEditor, showFolderEditor } from '$lib/stores/bookmarkEditor'
	import { showSettings } from '$lib/stores'
	import { blurOverlay } from '$lib/stores/blurOverlay'

	let overlay: HTMLDivElement
	let unblurBookmarks = $blurOverlay
</script>

<template lang="pug">
	
	.overlay(
		bind:this='{overlay}'
		class:blur='{$showFolderEditor || $showBookmarkEditor || $blurOverlay}'
		class:unblurBookmarks='{!$showSettings}'
	)

</template>

<style lang="scss">
	.overlay {
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
		background-color: rgba(var(--light-a-rgb), 0.1);
		backdrop-filter: saturate(0) contrast(1.05);
		z-index: 2;
	}

	.unblurBookmarks {
		z-index: 2;
	}
</style>
