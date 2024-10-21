<script lang="ts">
	import { run } from 'svelte/legacy';

	// Types
	import type { IHNItem } from './types'

	// Data
	import { BATCH_SIZE, INITIAL_SIZE } from './constants'
	import { items, list } from './stores'

	// Svelte
	import { fly } from 'svelte/transition'
	import { onMount, tick } from 'svelte'
	import { flip } from 'svelte/animate'
	import { get } from 'svelte/store'

	// Components
	import LoadingDots from '$lib/graphics/LoadingDots.svelte'
	import HnThread from './HNThread.svelte'
	import HNItem from './HNItem.svelte'

	// Utils
	import { fetchCategory, fetchItem, fetchStories } from './fetchData'
	import { fetchMeta } from '$lib/feeds/fetchMeta'
	import { wait } from 'fractils'

	let loaded = INITIAL_SIZE
	let loading = true

	const loadMore = async () => {
		// Debounce a bit
		if (loading)
			return setTimeout(() => {
				if (!loading) loadMore()
			}, 500)
		loading = true

		const newStories = await fetchStories($items.length)
		if (newStories.length === 0) return

		$items = [...$items, ...newStories]

		loaded = Math.min(loaded + BATCH_SIZE, get(list).length)
		loading = false
	}

	let scrollProgress = $state(0)
	const handleScroll = ({ target }: Event) => {
		const { scrollTop, scrollHeight, offsetHeight } = target as HTMLDivElement
		scrollProgress = Math.round((scrollTop / (scrollHeight - offsetHeight)) * 100)
	}

	run(() => {
		if (scrollProgress > 90) loadMore()
	});

	let activeThread: IHNItem['id'] = $state(null)

	let showThread = (e: CustomEvent) => {
		activeThread = null
		activeThread = e.detail.id
	}

	// Fullscreen screws up the layout, so we need to check for it
	let height = '100vh'
	let fullscreen = false
	const checkFullscreen = () => {
		fullscreen = window?.innerHeight == screen?.height
		height = fullscreen ? window.innerHeight + 'px' : '100vh'
	}

	const scrollToTop = () => {
		document.querySelector('.story-thread')?.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		})
	}

	let firstLoad = $state(true)
	onMount(async () => {
		$items = await fetchStories()
		loading = false
		await wait(1000)
		firstLoad = false
	})

	let animEl: HTMLElement = $state()
	let windowWidth: number
	let offsetWidth: number
	let left;
	run(() => {
		left = !!activeThread ? `0` : `${(windowWidth - offsetWidth) / 2}px`
	});

	const handleResize = () => {
		checkFullscreen()
		left = `${(windowWidth - offsetWidth) / 2}px`
	}

	const calcLeft = async (node: HTMLElement) => {
		left = !!activeThread ? `0` : `${(windowWidth - offsetWidth) / 2}px`
		await wait(100)
		animEl.style.transition = 'left 500ms cubic-bezier(.36,.57,.01,.99)'
	}
</script>

<template lang="pug">
	svelte:window(on:resize='{handleResize}' bind:innerWidth='{windowWidth}')

	.hn-container(style:height)

		.news-anim-container(bind:this='{animEl}' bind:offsetWidth style='left: {left};' class:activeThread)

			.story-previews.scroller.ghost(on:scroll='{handleScroll}' class:activeThread)

				+if('!$items?.length')

					LoadingDots

					+else

						span(use:calcLeft)

						+each('$items as item, i')

							.item(in:fly='{{ y: 10 + i, duration: 250 + (i * 50), delay: i * 50 * (firstLoad ? 1 : 0) }}')

								HNItem({item} bind:activeThread on:showThread='{showThread}')

		+if('activeThread')

			.story-previews-buffer

			.story-thread(transition:fly='{{ x: 20, duration: 750, delay: 0 }}')

				HnThread(threadId='{activeThread}')

				.to-top(on:click='{scrollToTop}') 🔝

</template>

<style lang="sass">
	$scrollbarOffset: 10%

	.hn-container
		display: flex
		position: relative
		justify-content: center

		width: 100vw

		border-bottom: 1px solid var(--light-a)

	.news-anim-container
		position: absolute
		display: flex

		height: 100vh

		backface-visibility: hidden
		pointer-events: none

		&.activeThread
			width: 100%

	.story-previews, .story-previews-buffer
		flex-direction: column
		align-items: center
		justify-content: center

		height: 100%
		max-height: 100%
		padding-top: 5rem
		padding-bottom: 10rem
		min-width: 600px

		pointer-events: all

		opacity: 0.75
		transition: opacity 0.2s
		&:hover
			opacity: 1

	
	.story-previews.activeThread
		width: 40%

	.story-previews-buffer
		width: 45%

	.story-thread
		display: flex
		flex-direction: column
		align-items: flex-start

		width: 60%
		height: 100%
		padding-top: 5rem
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
