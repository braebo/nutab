<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { mapRange, log } from 'fractils'

	let {
		root = $bindable(),
		disabled = $bindable(false),
		padding = 0.7,
		e = $bindable<Event>(),
	}: {
		/**
		 * The element to add the scrollbar to.  Can be a selector or an element.
		 */
		root: string | Element | HTMLElement
		/**
		 * Manually removes the scrollbar.
		 * @default false
		 */
		disabled?: boolean
		/**
		 * % of padding to add to the scrollbar track's start and end.
		 * @default 0.7
		 */
		padding?: number
		e?: Event
	} = $props()

	let viewHeight = $state<number>()
	let containerHeight = $state<number>()
	let ratio = $state<number>()
	let scrollbarHeight = $state<number>()
	let scrollbarHeightRatio = $state<number>()
	let scrollbarOffset = $state<number>()
	let scrollPercentage = $state<number>()

	onMount(() => {
		if (typeof root === 'string') {
			const rootEl = document.querySelector(root)
			if (!rootEl) {
				return log(
					`<Scrollbar /> error: root element with selector "${root}" not found`,
					'tomato',
				)
			}
			root = rootEl
		}

		if (!(root instanceof HTMLElement)) {
			return log('<Scrollbar /> error: provided root element is undefined', 'tomato')
		}

		const update = (ev: Event) => (e = ev)
		root.addEventListener('scroll', update)

		return root.removeEventListener('scroll', update)
	})

	onDestroy(() => (disabled = true))

	let reveal = $state(false)
	let timer: ReturnType<typeof setTimeout> | null = null

	function showScrollbar() {
		if (timer) clearTimeout(timer)
		reveal = true
		timer = setTimeout(() => {
			reveal = false
		}, 1000)
	}

	$effect(() => {
		if (e) {
			if (
				!disabled &&
				root instanceof HTMLElement &&
				e instanceof Event &&
				'currentTarget' in e
			) {
				const target = e.currentTarget as HTMLElement
				containerHeight = root?.clientHeight
				viewHeight = root.clientHeight
				ratio = parseFloat((viewHeight / root?.scrollHeight).toFixed(3))
				scrollbarHeight = Math.max(Math.round(viewHeight * ratio), 25)
				scrollbarHeightRatio = parseFloat((scrollbarHeight / viewHeight).toFixed(4)) * 100
				scrollbarOffset = viewHeight / scrollbarHeightRatio
				const paddingOffset = containerHeight * (padding / 100)
				const paddingOffset2 = paddingOffset * 2
				scrollPercentage = mapRange(
					target?.scrollTop,
					0,
					root?.scrollHeight,
					0 + paddingOffset,
					containerHeight - paddingOffset2,
				)
			}

			showScrollbar()
		}
	})
</script>

<!-- <svelte:window on:scroll={() => update()} /> -->

{#if !disabled}
	<div
		class:reveal
		class="mac-scrollbar"
		style="--scrollbar-height: {scrollbarHeight}px; top: {scrollPercentage}px"
	></div>
{/if}

<style>
	:global(body) {
		overflow-y: hidden;
	}
	.mac-scrollbar {
		position: fixed;
		right: 5px;
		z-index: 9999;

		margin: auto;
		width: 7px;
		height: var(--scrollbar-height);

		background: var(--mac-scrollbar-color, var(--fg-d));
		border-radius: 20px;
		opacity: 0;

		overflow: hidden;
		transition: opacity 0.25s;
	}
	.reveal {
		opacity: 1 !important;
	}
</style>
