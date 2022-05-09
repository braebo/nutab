<script lang="ts">
	import { showBookmarkEditor, showFolderEditor } from '$lib/stores/bookmarkEditor'
	import { showSettings } from '$lib/data/settings/settingsStore'

	let overlay: HTMLDivElement
	let unblurBookmarks = false

	$: if ($showSettings) {
		overlay.style.zIndex = '2'
		unblurBookmarks = true
	}

	$: if (!$showSettings) {
		if (unblurBookmarks) {
			console.warn('starting')
			overlay.addEventListener(
				'transitionend',
				() => {
					console.warn('allDone')
					overlay.style.zIndex = '4'
					unblurBookmarks = false
				},
				{ once: true }
			)
		}
	}
</script>

<template lang="pug">
	
	.overlay(
		bind:this='{overlay}'
		class:blur='{$showFolderEditor || $showBookmarkEditor || $showSettings}'
		class:unblurBookmarks
	)

</template>

<style lang="sass">

	.overlay
		position: absolute
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
