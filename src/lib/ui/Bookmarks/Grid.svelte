<script lang="ts">
	// Data
	import { activeBookmarks, activeFolder, tagFilter } from '$lib/data/dbStore'
	import { grid, gridDimensions, reRender } from '$lib/stores/gridStore'
	import { showGuidelines } from '$lib/data/settings/settingsStore'
	import { swapBookmarks_db } from '$lib/data/transactions'
	import { searchValue } from '$lib/search/searchStore'

	// Components
	import Edit from '$lib/graphics/icons/Edit.svelte'
	import Bookmark from './Bookmark.svelte'

	// Utils
	import { editor } from '$lib/stores/bookmarkEditor'
	import { debounce } from '$lib/utils/debounce'
	import { scale } from 'svelte/transition'
	import { goto } from '$app/navigation'

	let hovering: number | null = null

	let dragging = false

	// The element to drag
	let active: number = null

	// The element to swap with
	let target: number = null
	let lastTarget: number = null

	// Mouse movement for dragging active element
	let move = { x: 0, y: 0 }

	// Temporary positions for animations while dragging
	let positionProxy = Array($gridDimensions.positions.length).fill(null)

	// Cell transition animation duration in ms
	const transitionDuration = 250

	// Temporarily disables target detection
	let cooldown = false

	// Temporarily disables transitions
	let disableTransitions = false

	// A ref to each cell
	let cells: HTMLElement[] = []

	// Hides and shows the edit icon for each bookmark.
	let showEditIcon: boolean[] = Array($grid.items?.length).fill(false)
	// Ugly hack $grid.items is not defined on first render
	let first = false
	$: if (!first && showEditIcon.length < $grid?.items?.length) {
		first = true
		showEditIcon = Array($grid.items.length).fill(false)
	}

	const handleMouseUp = async (e: MouseEvent) => {
		// If we have a target, swap the elements
		if (target !== null && active != null && target != active) {
			await swap(active, target)
			$activeFolder = $activeFolder
		}

		// TODO It would be nice to smoothly animate the dragged
		// item upon release.  Perhaps that could be done here.

		// Reset all the things
		dragging = false
		active = null
		target = null
		lastTarget = null
		move = { x: 0, y: 0 }
		positionProxy = positionProxy.fill(null)
	}

	const handleMouseDown = (e: MouseEvent) => {
		// Disable re-arranging when filter is active
		if ($tagFilter) return

		// Store index of active item located in its classname. i.e. - "item-3"
		const activeClass = (e.target as Element).classList[0]
		if (activeClass?.startsWith('item-')) {
			active = parseInt(activeClass.split('-')[1])
		}
	}

	const handleMouseMove = (e: MouseEvent) => {
		// Make sure we have an active cell first
		if (active === null) return
		else dragging = true

		// Update movement vector
		move.x += e.movementX
		move.y += e.movementY

		// If we're hovering over a cell and not on cooldown
		if (!cooldown && (e.target as Element).classList[0]?.split('-')[1] != null) {
			// Store the target cell's index
			target = parseInt((e.target as Element).classList[0]?.split('-')[1])

			// If our target cell has changed
			if (lastTarget != null && lastTarget != target) {
				// go back to original position
				positionProxy[lastTarget] = null
			}

			// If the target cell isn't the current active cell
			if (target != active) {
				// Move it to our active's cell position
				positionProxy[target] = $gridDimensions.positions[active]
			} else {
				// We have returned to the original cell, so we can reset all positions
				positionProxy = positionProxy.fill(null)
			}

			// Update lastTarget
			lastTarget = target

			// apply cooldown to avoid jank
			setCooldown()
		}
	}

	function toggleShowEditIcon(bool: boolean, i: number) {
		showEditIcon = showEditIcon.map((x, index) => (index === i ? bool : !bool))
	}

	function handleItemMouseOver(i: number) {
		hovering = i
		debounce(() => toggleShowEditIcon(true, i), 500)
	}

	function handleItemMouseOut(i: number) {
		hovering = null
		debounce(() => (showEditIcon[i] = false))
	}

	// Hide edit icon while dragging
	$: if (dragging) {
		hovering = null
		showEditIcon.fill(false)
	}

	let cooldownTimer: NodeJS.Timeout
	function setCooldown() {
		cooldown = true
		clearTimeout(cooldownTimer)
		cooldownTimer = setTimeout(() => {
			cooldown = false
		}, transitionDuration * 0.75)
	}

	$: getCellPosition = (i: number) => {
		if (positionProxy[i] != null) {
			return `translate(${positionProxy[i].x}px, ${positionProxy[i].y}px)`
		} else {
			return `translate(${$gridDimensions.positions[i].x}px, ${$gridDimensions.positions[i].y}px)`
		}
	}

	$: $gridDimensions

	let swapTimer: NodeJS.Timeout
	const swap = async (a: number, b: number) => {
		// A bit of a hack to make sure the swap doesn't trigger the wrong animations
		clearTimeout(swapTimer)
		swapTimer = setTimeout(async () => {
			disableTransitions = false
		}, 100)

		return new Promise<void>(async (resolve, reject) => {
			disableTransitions = true

			// Swap the elements and update stores / db
			const _a = $activeBookmarks[a]
			const _b = $activeBookmarks[b]
			if (!_a || !_b) return
			const aPosition = _a.position
			const bPosition = _b.position
			_a.position = bPosition
			_b.position = aPosition
			if (_a.position === _b.position) {
				reject(console.error('Error: Bookmarks are in the same position'))
			}
			$activeBookmarks[a] = _b
			$activeBookmarks[b] = _a
			await swapBookmarks_db([_a, _b])

			resolve()
		})
	}

	const isRelevant = (i: number) => {
		const bm = $activeBookmarks[i]
		return (
			bm.title.toLowerCase().includes($searchValue.toLowerCase()) ||
			bm.description.toLowerCase().includes($searchValue.toLowerCase())
		)
	}
</script>

<svelte:window on:mousedown={handleMouseDown} on:mouseup={handleMouseUp} on:mousemove={handleMouseMove} />

<div
	class="grid"
	class:showGuidelines={$showGuidelines}
	class:dragging
	style="
		width: {$grid.gridWidth}px;
		height: {$gridDimensions.gridHeight}px;
		--item-size: {$grid.iconSize}px;
	"
>
	{#if $grid.items}
		{#each $grid.items as bookmark, i (bookmark.bookmark_id)}
			{#key $reRender}
				<div
					class:unfocused={$searchValue !== '' && !isRelevant(i)}
					class:focused={$searchValue === '' || isRelevant(i)}
					class="cell-{i} cell"
					class:active={i == active}
					class:target={target === i}
					style="
						width: {$gridDimensions.totalItemSize}px;
						height: {$grid.iconSize}px;
						transform: {getCellPosition(i)};
						transition: {disableTransitions ? 'none' : `${transitionDuration}ms`};
					"
					bind:this={cells[i]}
				>
					<div
						class="item-{i} grid-item"
						class:active={active === i}
						class:target={target === i}
						draggable="false"
						class:dragging
						class:disableTransitions
						style="transform: translate({active === i ? `${move.x}px, ${move.y}px` : `0, 0`});"
						on:mouseover={() => handleItemMouseOver(i)}
						on:mouseout={() => handleItemMouseOut(i)}
						on:focus={() => handleItemMouseOver(i)}
						on:blur={() => handleItemMouseOut(i)}
					>
						<div class="grid-image">
							<Bookmark
								{bookmark}
								{hovering}
								{dragging}
								{i}
								on:showBookmarkEditor
								--size={$grid.iconSize + 'px'}
								{disableTransitions}
							/>
						</div>
						{#if showEditIcon[i] && !dragging}
							<div
								on:mouseover={() => handleItemMouseOver(i)}
								on:mouseout={() => handleItemMouseOut(i)}
								on:focus={() => handleItemMouseOver(i)}
								on:blur={() => handleItemMouseOut(i)}
								class="edit"
								transition:scale={{ duration: 150 }}
								on:click|preventDefault|stopPropagation={() => editor.show(['edit', 'bookmark'], i)}
							>
								<Edit />
							</div>
						{/if}
					</div>
				</div>
			{/key}
		{/each}
	{/if}
</div>

<style lang="scss">
	.grid {
		position: relative;

		margin: 1vh auto;
		box-sizing: border-box;

		// for $showGuidelines
		border: 1px solid #0000;
		border-top: none;
		border-bottom: none;

		transition: border 0.2s ease-in-out;

		&.showGuidelines {
			border: 1px solid rgba(var(--dark-d-rgb), 0.5);
			border-bottom: none;
			border-top: none;
		}

		z-index: 3;
		user-select: none;
	}

	.cell {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;

		&.active {
			z-index: 10 !important;
		}

		&.unfocused {
			opacity: 0.5;
		}
		&.focused {
			opacity: 1;
		}
	}

	.grid-item {
		width: var(--item-size);
		height: var(--item-size);
		margin: auto;

		color: white;

		cursor: pointer;
		pointer-events: all;

		transition: 0.2s ease-in-out;

		&.active {
			pointer-events: none;
			z-index: 10 !important;

			transition: none;
		}

		&.target:not(.active) {
			z-index: -1;
		}

		&.disableTransitions {
			transition: none;
		}
	}

	.dragging {
		cursor: grabbing;
	}

	.add-bookmark {
		position: absolute;
		left: 0;
		right: 0;

		width: fit-content;
		margin: auto;

		color: var(--dark-a);
		opacity: 0.025;

		font-size: 3rem;

		cursor: pointer;
		transition: opacity;
		transition-duration: 0.15s;
		transition-delay: 1s;

		&:hover {
			opacity: 0.75 !important;

			transition-duration: 1s;
			transition-delay: 0s;
		}
	}

	.grid:hover .add-bookmark {
		opacity: 0.25;
		transition-duration: 3s;
		transition-delay: 0s;
	}

	.grid-image {
		width: 100%;
		height: 100%;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;

		pointer-events: none;
	}

	.edit {
		position: absolute;
		top: -10px;
		right: -10px;

		width: max-content;
		width: 2rem;
		height: max-content;

		border-radius: 5px;

		font-size: 2rem;
		line-height: 0.2rem;

		cursor: pointer;
		transition: 0.2s;
		transform: scale(1);
		z-index: 15;
	}

	.edit:hover {
		transform: scale(1.1);
	}
</style>
