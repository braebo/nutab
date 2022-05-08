<script lang="ts">
	import LoadingDots from '$lib/graphics/LoadingDots.svelte'
	import type { IHNItem } from './types'

	import { fly } from 'svelte/transition'
	import { get } from 'svelte/store'
	import { onMount } from 'svelte'

	import HnThread from './HNThread.svelte'
	import HNItem from './HNItem.svelte'

	import { fetchCategory, fetchItem, fetchStories } from './fetchData'
	import { fetchMeta } from '$lib/feeds/fetchMeta'

	import { BATCH_SIZE, INITIAL_SIZE } from './constants'
	import { items, list } from './stores'

	let loaded = INITIAL_SIZE
	let loading = true

	const loadMore = async () => {
		if (loading)
			return setTimeout(() => {
				if (!loading) loadMore()
			}, 500)
		loading = true

		const newStories = await fetchStories($items.length)
		console.log({ newStories })
		$items = [...$items, ...newStories]
		console.log({ $items })

		loaded = Math.min(loaded + BATCH_SIZE, get(list).length)
		loading = false
	}

	let scrollProgress = 0
	let itemsLeft = 450
	const handleScroll = ({ target }: Event) => {
		itemsLeft = loaded / get(list).length
		const { scrollTop, scrollHeight, offsetHeight } = target as HTMLDivElement
		scrollProgress = Math.round((scrollTop / (scrollHeight - offsetHeight)) * 100)
	}

	$: trigger = 95 + 5 * itemsLeft
	$: if (scrollProgress > 90) loadMore()

	let activeThread: IHNItem['id'] = null

	let showThread = (e: CustomEvent) => {
		activeThread = null
		activeThread = e.detail.id
	}

	let height = '100vh'
	let fullscreen = false
	const checkFullscreen = () => {
		fullscreen = window?.innerHeight == screen?.height
		height = fullscreen ? window.innerHeight + 'px' : '100vh'
		console.log({ height })
	}

	const scrollToTop = () => {
		document.querySelector('.story-thread')?.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		})
	}

	onMount(async () => {
		$items = await fetchStories()
		loading = false
	})
</script>

<template lang="pug">
	svelte:window(on:resize='{checkFullscreen}')

	.hn-container(style:height)
		.story-previews.scroller.ghost(on:scroll='{handleScroll}' class:activeThread)
			+if('!$items.length')
				LoadingDots
				+else
					+each('$items as item, i')
						.item(in:fly='{{duration: 250 + (i * 50), delay: i * 50 * 0, y: 10 + i}}')
							HNItem({item} bind:activeThread on:showThread='{showThread}')

		+if('activeThread')
			.story-thread
				HnThread(threadId='{activeThread}')
				.to-top(on:click='{scrollToTop}') 🔝

	//- pre.debug(style='position:absolute;top:3rem;left:3rem;')
	//- 	| scrollProgress: {scrollProgress}
	//- 	| itemsLeft: {100 - (itemsLeft * 100)}%
	//- 	| loaded: {loaded}
	//- 	| activeThread: {activeThread}
	//- 	| items: {items}
</template>

<style lang="sass">
	$scrollbarOffset: 10%

	.hn-container
		display: flex
		position: relative
		// align-items: center
		justify-content: center
		padding-top: 5rem

		width: 100vw

		border-bottom: 1px solid var(--light-a)

	.story-previews
		flex-direction: column
		align-items: center
		justify-content: center

		height: 100%
		max-height: 100%
		padding-bottom: 10rem
		min-width: 600px
		&.activeThread
			width: 40%
		
		opacity: 0.75
		transition: opacity 0.2s
		&:hover
			opacity: 1

	.story-thread
		display: flex
		flex-direction: column
		align-items: flex-start

		width: 60%
		height: 100%
		padding-bottom: 10rem

		overflow-y: auto

		margin-right: 4%	// offset the srollbar...
		padding-right: 1%	// ...just a bit

		&, :global(pre)
			&::-webkit-scrollbar-track
				background: transparent
			&::-webkit-scrollbar
				width: 0.5rem
				height: 0.5rem
				background: transparent
			&::-webkit-scrollbar-thumb
				background: rgba(var(--light-d-rgb), 0.5)
				border-radius: 5px

	.item
		display: flex
		flex-direction: column

		width: 100%

	.to-top
		font-size: 2rem
		text-align: center
		margin: 2rem auto 0 auto
		cursor: pointer
</style>
