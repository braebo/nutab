<script lang="ts">
	import News from '$lib/feeds/News.svelte'
	import { visibility } from 'fractils'
	import { onMount } from 'svelte'

	let main: HTMLDivElement
	let slot: HTMLDivElement

	onMount(() => {
		main.scrollTo(0, slot.offsetTop)
	})

	let visible

	function handleChange(e: CustomEvent) {
		console.log(Object.entries(e.detail))
		visible = e.detail.isVisible
		// scrollDir = e.detail.scrollDirection
	}
</script>

<template lang="pug">

	main(bind:this='{main}')
		.col
			//- .news(use:visibility!='{{ threshold: 0.05, once: true, margin: "20px" }}' on:change='{handleChange}')
				//- +if('visible')
			.news
				News

			.bookmarks(bind:this='{slot}')
				slot

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
