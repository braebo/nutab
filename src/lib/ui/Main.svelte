<script lang="ts">
	import FolderSidebar from '$lib/ui/Folders/FolderSidebar.svelte'
	import { activeSection } from '$lib/stores/mainStore'
	import News from '$lib/feeds/News.svelte'
	import { visibility } from 'fractils'
	import { onMount } from 'svelte'

	let main: HTMLDivElement
	let bookmarks: HTMLDivElement

	onMount(() => {
		main.scrollTo(0, bookmarks.offsetTop)
	})

	let newsVisible = false

	function handleChange(e: CustomEvent) {
		if (!newsVisible) newsVisible = e.detail.isVisible
		$activeSection = e.detail.isVisible ? 'news' : 'bookmarks'
	}
</script>

<template lang="pug">

	main(bind:this='{main}')
		.col
			.news(use:visibility!='{{ threshold: 0.05, margin: "20px" }}' on:change='{handleChange}')
				+if('newsVisible')
					News

			.bookmarks(bind:this='{bookmarks}')
				slot
				FolderSidebar

</template>

<style lang="sass">

	main
		min-height: 100vh

		overflow-y: auto
		scroll-snap-type: y mandatory

		&::-webkit-scrollbar
			display: none

	.col
		min-height: 200vh

	.news
		display: flex

	.bookmarks, .news
		scroll-snap-align: start
		contain: content
		min-height: 100vh
		min-width: 100vw

</style>
