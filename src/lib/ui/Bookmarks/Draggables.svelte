<script lang="ts">
	// Types
	import type { Bookmark } from '$lib/data/types'

	// Data
	import { activeFolder } from '$lib/data/dbStore'
	import { settings } from '$lib/settings/settingsStore'

	// Components
	import Tooltip from './../Tooltip.svelte'
	import { tick, createEventDispatcher } from 'svelte'
	import BM from '$lib/ui/Bookmarks/Bookmark.svelte'

	// Utils
	import { spring } from 'svelte/motion'
	import { mapRange } from 'fractils'

	let active = -1
	let container: HTMLElement
	let box_el: { [x: string]: HTMLElement } = {}
	let box_start = 0
	let dragPosition = spring(0, { stiffness: 0.05, damping: 0.75 })
	let hovering: number | null = null
	let activeSet = true

	$: box_el[1] && activeSet && set_positions()

	// set the correct absolute positions

	const dispatch = createEventDispatcher()

	let first = true
	function set_positions() {
		// disable animation on first load
		if (first) {
			document.querySelectorAll('li').forEach((el) => {
				el.style.transition = 'none'
			})
			setTimeout(() => {
				document.querySelectorAll('li').forEach((el) => {
					el.style.transition = 'transform 0.2s, background 0.2s, box-shadow 0.2s'
				})
				activeSet = false
			}, 1500)
			first = false
		}

		container.style.position = 'relative'
		const item_count = $activeFolder.bookmarks.length
		let offset = 0

		// get the bookmark width + gridGap setting
		const width = $settings.ranges.cellSize.value + $settings.ranges.gridGap.value

		$activeFolder.bookmarks.forEach(({ position }, index) => {
			const _el = box_el[position]

			const { x, y } = _el.getBoundingClientRect()
			// get grid offset from center
			const from_center = (item_count * width) / 2 - width / 2

			if (position !== active || !dragging) {
				box_el[position].style.transform = `translateX(${offset - index - from_center}px)`
			}
			box_positions[position] = {
				x: offset - index - from_center,
				mid: offset + width / 2 - from_center,
				width
			}

			offset += width

			// _height = _height > height + y - container_y ? _height : height + y - container_y
		})

		// container.style.height = _height + 'px'
	}

	let dragging: boolean = false
	let cancel_drag
	let clientX_start = 0
	let timer: NodeJS.Timeout

	let box_positions: {
		[x: string]: { x: number; mid: number; width: number }
	} = {}
	let container_offset = 0

	// wait for a small duration before doing anything to distinguish clicks from potential drags
	// the mouse up handler will bail us out
	async function handle_mousedown({ clientX }: MouseEvent, id: number) {
		active = id
		console.log(id)
		dispatch('change', id)
		await tick()
		// we need to wait for active to be set before we can start transforming
		activeSet = true

		// we have other mousedown events, we need to wait a little so we don't get confused
		timer = setTimeout(async () => {
			dragging = true

			// we don't really want to be querying the style too much on mousemove
			// we will do as much up-front work as possible

			// get the initial clientX position when the interaction started
			clientX_start = clientX

			// grab the current container offset
			container_offset = container.getBoundingClientRect().x

			// and the initial position of the current box,
			box_start = box_positions[active].x
		}, 200)
		// $dragPosition = box_positions[active].x
		dragPosition.set(box_positions[active].x, { hard: true })
	}

	let threshold_passed: boolean = false

	async function handle_mouseup(e: MouseEvent) {
		// if the drag hasn't started we need to cancel it here
		if (!dragging) {
			clearTimeout(timer)
			return
		}

		// if we were dragging we need to stop doing that now
		dragging = false
		threshold_passed = false

		requestAnimationFrame(() => {
			// $dragPosition = box_positions[active].x
			dragPosition.set(box_positions[active].x, { soft: true })
			// box_el[active].style.setProperty(
			// 	'transform',
			// 	`translateX(${box_positions[active].x}px)`
			// )
		})
		activeSet = false
	}

	const throttled_position = throttle(requestAnimationFrame)

	function within_range(num: number, from: number, to: number): boolean {
		return num >= from && num <= to
	}

	async function handle_mousemove({ clientX, movementX }: MouseEvent) {
		if (!dragging) return
		if (!threshold_passed && within_range(clientX - clientX_start, -15, 15)) return

		threshold_passed = true

		await tick()

		// add the latest positions to the raf queue
		// throttled_position(['transform', `translateX(${box_start + (clientX - clientX_start)}px)`])
		$dragPosition = box_start + (clientX - clientX_start)

		const _index = $activeFolder.bookmarks.findIndex((v) => active === v.position)
		const right = box_positions[active].width + box_start + (clientX - clientX_start)

		if (
			movementX > 0 &&
			_index < $activeFolder.bookmarks.length - 1 &&
			right > box_positions[$activeFolder.bookmarks[_index + 1].position].mid
		) {
			swap($activeFolder.bookmarks, _index, _index + 1)
		} else if (
			movementX < 0 &&
			_index > 0 &&
			box_start + (clientX - clientX_start) <
				box_positions[$activeFolder.bookmarks[_index - 1].position].mid
		) {
			swap($activeFolder.bookmarks, _index, _index - 1)
		}
		// tabs = tabs
		await tick()
	}

	// we don't want to write to the dom on every mousevent
	// we will throttle the operations once per frame
	// this is basically lodash/throttle but raf
	function throttle(timer: typeof requestAnimationFrame) {
		let queued_property_def: null | [string, string] = null

		return (property_def: [string, string]) => {
			if (!queued_property_def) {
				timer(() => {
					const _current = queued_property_def as [string, string]
					// box_el[active].style.setProperty(_current[0], _current[1])
					queued_property_def = null
				})
			}
			queued_property_def = property_def
		}
	}

	function swap(arr: Array<any>, index_a: any, index_b: any) {
		const _t = arr[index_a]
		const _p = arr[index_a].position
		const _p2 = arr[index_b].position
		arr[index_a] = arr[index_b]
		arr[index_b] = _t
		$activeFolder.bookmarks[index_a].position = _p2
		$activeFolder.bookmarks[index_b].position = _p
	}

	$: svgDot = container
		? mapRange($dragPosition, 0, container.getBoundingClientRect().width, 0, 100)
		: 0
</script>

<svelte:window on:mouseup={handle_mouseup} on:mousemove={handle_mousemove} />

<ul class="folder-container" bind:this={container}>
	<!-- prettier-ignore -->
	<!-- <svg class="debugDot" style="border: 1px solid blue;" viewBox="0 0 {container?.getBoundingClientRect().width} {container?.getBoundingClientRect().height}">
		<circle r="10" cx={$dragPosition + container?.getBoundingClientRect().width / 2} cy={container?.getBoundingClientRect().height} fill="red"/>
	</svg> -->
	{#if $activeFolder}
		{#each $activeFolder.bookmarks as bookmark (bookmark.position)}
			<li
				bind:this={box_el[bookmark.position]}
				class="box bookmark-container"
				class:active={active === bookmark.position}
				class:inactive={active !== bookmark.position && dragging}
				class:startdrag={active === bookmark.position && dragging}
				class:dragging={active === bookmark.position && threshold_passed}
				on:mousedown={(e) => handle_mousedown(e, bookmark.position)}
				style="
				width: {$settings.ranges.cellSize.value}px;
				height: {$settings.ranges.iconSize.value}px;
				margin: {$settings.ranges.gridGap.value}px;
				{bookmark.position === active ? `transform: translateX(${$dragPosition}px)` : ''}
			"
				on:mouseover={() => (hovering = bookmark.position)}
				on:mouseout={() => (hovering = null)}
				on:focus={() => (hovering = bookmark.position)}
				on:blur={() => (hovering = null)}
			>
				<BM {bookmark} {dragging} {hovering} i={bookmark.position} on:showEditor />
			</li>
		{/each}
		<div class="add-bookmark" on:click={() => dispatch('newBookmark')}>
			<Tooltip content="New_Bookmark" placement="bottom" offset={[0, 10]}>+</Tooltip>
		</div>
	{/if}
</ul>

<style>
	ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;

		max-width: 100vw;
		margin-top: 5%;

		list-style: none;

		font-family: 'Overpass';
	}

	li {
		display: flex;
		position: absolute;

		transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
		user-select: none;
		cursor: pointer;

		z-index: 1;
	}

	.active {
		z-index: 9;
	}
	.inactive {
		pointer-events: none;
	}

	.dragging {
		pointer-events: all;
		transition: none;
		cursor: grabbing !important;
	}

	.startdrag {
		cursor: grab;
	}

	.add-bookmark {
		position: absolute;
		left: 0;
		right: 0;
		bottom: -7rem;

		width: fit-content;
		margin: auto;

		color: var(--dark-a);
		opacity: 0.1;

		font-size: 3rem;

		cursor: pointer;
		transition: opacity 0.15s;
	}

	.add-bookmark:hover {
		opacity: 0.75;

		transition: opacity 0.4s;
	}
</style>
