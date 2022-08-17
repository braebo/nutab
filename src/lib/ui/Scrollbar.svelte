<script context="module" lang="ts">
	import { writable } from 'svelte/store'

	export const fml = writable<Record<string, any>>({})
</script>

<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte'
	import { mapRange } from 'fractils'

	export let target: HTMLElement
	let scrollHeight: number
	let targetHeight: number
	let ratio: number
	let scrollbarHeight: number
	let scrollbarHeightRatio: number
	let scrollbarOffset: number
	let scrollPercentage: number

	onMount(async () => {
		await tick()
		// target ??= document.documentElement
		target.addEventListener('scroll', (e) => {
			update()
		})
		update()
	})

	// async function update() {
	const update = async (e?: Event) => {
		console.log({ target })
		scrollTop = (e?.target as HTMLElement)?.scrollTop ?? 0
		console.log({ scrollTop })
		await tick()

		if (!target) return

		targetHeight = target.getBoundingClientRect().height ?? window.innerHeight

		scrollHeight = target.scrollHeight

		ratio = parseFloat((targetHeight / scrollHeight).toFixed(3))

		scrollbarHeight = Math.max(Math.round(targetHeight * ratio), 15)

		scrollbarHeightRatio = parseFloat((scrollbarHeight / targetHeight).toFixed(4)) * 100

		scrollbarOffset = targetHeight / scrollbarHeightRatio

		scrollPercentage = mapRange(target.scrollTop, 0, target.scrollHeight, 0, 100)

		showScrollbar()

		$fml = {
			scrollHeight,
			targetHeight,
			ratio,
			scrollbarHeight,
			scrollbarHeightRatio,
			scrollbarOffset,
			scrollPercentage,
			scrollTop,
		}
	}

	let reveal = false
	let timer: NodeJS.Timeout = null

	function showScrollbar() {
		if (timer) clearTimeout(timer)
		reveal = true
		timer = setTimeout(() => {
			reveal = false
		}, 1000)
	}

	onDestroy(() => {
		clearTimeout(timer)
		target?.removeEventListener('scroll', update)
	})

	$: scrollTop = target?.scrollTop
</script>

<svelte:window on:scroll={update} on:resize={update} />

<div class:reveal class="scrollbar" style="--scrollbar-height: {scrollbarHeight}px; top: {scrollPercentage}%" />

<style>
	:global(body::-webkit-scrollbar) {
		display: none;
		/* IE and Edge */
		-ms-overflow-style: none;
		/* Firefox */
		scrollbar-width: none;
	}

	.scrollbar {
		cursor: pointer;
		position: fixed;
		right: 5px;
		margin: auto;
		width: 7px;
		height: var(--scrollbar-height);
		background: #0007;
		border-radius: 20px;
		overflow: hidden;
		opacity: 0;
		transition: opacity 0.25s;
		z-index: 99999;
	}

	.reveal {
		opacity: 1;
	}
</style>
