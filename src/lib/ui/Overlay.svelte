<script lang="ts">
	import { showBookmarkEditor, showFolderEditor } from '$lib/stores/bookmarkEditor'
	import { blurOverlay } from '$lib/stores/blurOverlay'

	let overlay: HTMLDivElement
	let unblurBookmarks = false

	$: if ($blurOverlay) {
		overlay.style.zIndex = '2'
		unblurBookmarks = true
	}

	$: if (!$blurOverlay) {
		if (unblurBookmarks) {
			overlay.addEventListener(
				'transitionend',
				() => {
					overlay.style.zIndex = '4'
					unblurBookmarks = false
				},
				{ once: true },
			)
		}
	}
</script>

<template lang="pug">
	
	.overlay(
		bind:this='{overlay}'
		class:blur='{$showFolderEditor || $showBookmarkEditor || $blurOverlay}'
		class:unblurBookmarks
	)

</template>

<style lang="sass">

	.overlay
		position: fixed
		bottom: 0
		
		height: 100%
		width: 100%
		
		transition: backdrop-filter 0.3s
		pointer-events: none
		z-index: 4

	.blur
		background-color: rgba(var(--light-b-rgb), 0.01)
		backdrop-filter: blur(3px)

	.unblurBookmarks
		z-index: 2

</style>
