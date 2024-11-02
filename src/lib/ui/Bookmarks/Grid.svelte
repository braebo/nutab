<script lang="ts">
	// Data
	// import { activeBookmarks, activeFolder, tagFilter } from '$lib/data/dbStore'
	import { swapBookmarks_db } from '$lib/data/transactions.svelte'
	import { search_state } from '$lib/search/search_state.svelte'
	import { grid } from '$lib/stores/grid.svelte'
	import { db } from '$lib/data/db.svelte'

	// Components
	import Edit from '$lib/graphics/icons/Edit.svelte'
	import Bookmark from './Bookmark.svelte'

	// Utils
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	import { smoothToggle } from '$lib/utils/smoothToggle'
	import { scale } from 'svelte/transition'
	import { untrack } from 'svelte'

	let hovering: number | null = $state(null)

	let dragging = $state(false)

	/** The element to drag */
	let active = $state<number | null>(null)

	/** The element to swap with */
	let target = $state<number | null>(null)
	let lastTarget = $state<number | null>(null)

	/** Mouse movement for dragging active element */
	let move = $state({ x: 0, y: 0 })

	/** Temporary positions for animations while dragging */
	let positionProxy = $state(Array(grid.dimensions.positions.length).fill(null))

	/** Cell transition animation duration in ms */
	const transitionDuration = 250

	/** Temporarily disables target detection */
	let cooldown = false

	/** Temporarily disables transitions */
	let disableTransitions = $state(false)

	/** A ref to each cell */
	let cells: HTMLElement[] = $state([])

	/** Hides and shows the edit icon for each bookmark. */
	let showEditIcon: boolean[] = $state(Array(db.activeBookmarks?.length).fill(false))

	// Ugly hack (grid.items is not defined on first render)
	let first = $state(false)
	$effect(() => {
		grid
		db.activeBookmarks
		untrack(() => {
			if (!first && showEditIcon.length < (db.activeBookmarks?.length ?? 0)) {
				first = true
				showEditIcon = Array(db.activeBookmarks?.length ?? 0).fill(false)
			}
		})
	})

	const handleMouseUp = async (_e: MouseEvent) => {
		// If we have a target, swap the elements
		if (target !== null && active != null && target != active) {
			await swap(active, target)
			// db.activeFolder = db.activeFolder
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
		if (db.tagFilter) return

		e.stopPropagation()
		// e.preventDefault()

		// Store index of active item located in its classname. i.e. - "item-3"
		const activeClass = (e.target as Element).classList[0]
		if (activeClass?.startsWith('item-')) {
			active = parseInt(activeClass.split('-')[1])
		} else {
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
		if (!cooldown && (e.target as HTMLElement)?.dataset?.cell) {
			// Store the target cell's index
			target = parseInt((e.target as HTMLElement)?.dataset?.cell ?? '')

			// If our target cell has changed
			if (lastTarget != null && lastTarget != target) {
				// go back to original position
				positionProxy[lastTarget] = null
			}

			// If the target cell isn't the current active cell
			if (target != active) {
				// Move it to our active cell's position
				positionProxy[target] = grid.dimensions.positions[active]
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

	const toggleEditIcon = smoothToggle((s, i: number) => (showEditIcon[i] = s), [500])

	function handleItemMouseOver(i: number) {
		hovering = i
		toggleEditIcon(true, i)
	}

	function handleItemMouseOut(i: number) {
		hovering = null
		toggleEditIcon(false, i)
	}

	// Hide edit icon while dragging
	$effect(() => {
		dragging
		hovering
		if (dragging && hovering !== null) {
			hovering = null
			showEditIcon.fill(false)
		}
	})

	let cooldownTimer: ReturnType<typeof setTimeout>
	function setCooldown() {
		cooldown = true
		clearTimeout(cooldownTimer)
		cooldownTimer = setTimeout(() => {
			cooldown = false
		}, transitionDuration * 0.75)
	}

	let getCellPosition = $derived((i: number) => {
		if (positionProxy[i] != null) {
			return `translate(${positionProxy[i].x}px, ${positionProxy[i].y}px)`
		} else {
			return `translate(${grid.dimensions.positions[i].x}px, ${grid.dimensions.positions[i].y}px)`
		}
	})

	let swapTimer: ReturnType<typeof setTimeout>
	const swap = async (a: number, b: number) => {
		// A bit of a hack to make sure the swap doesn't trigger the wrong animations
		clearTimeout(swapTimer)
		swapTimer = setTimeout(async () => {
			disableTransitions = false
		}, 10)

		return new Promise<void>(async (resolve, reject) => {
			disableTransitions = true

			if (!db.activeBookmarks) {
				return reject(console.error('Error: db.activeBookmarks is falsey'))
			}

			// Swap the elements and update stores / db
			const _a = $state.snapshot(db.activeBookmarks[a])
			const _b = $state.snapshot(db.activeBookmarks[b])
			if (!_a || !_b) return

			const aPosition = _a.position
			const bPosition = _b.position
			_a.position = bPosition
			_b.position = aPosition
			if (_a.position === _b.position) {
				return reject(console.error('Error: Bookmarks are in the same position'))
			}

			// db.activeBookmarks[a] = _b
			// db.activeBookmarks[b] = _a
			await swapBookmarks_db([_a, _b])

			resolve()
		})
	}

	const isRelevant = (i: number) => {
		const bm = db.activeBookmarks?.[i]
		return (
			bm?.title.toLowerCase().includes(search_state.searchValue?.toLowerCase() ?? '') ||
			bm?.description.toLowerCase().includes(search_state.searchValue?.toLowerCase() ?? '')
		)
	}
</script>

<svelte:window onmouseup={handleMouseUp} onmousemove={handleMouseMove} />

<div
	class="grid"
	class:showGuidelines={grid.showGuidelines}
	class:dragging
	style="
		width: {grid.width}px;
		height: {grid.dimensions.gridHeight}px;
		--item-size: {grid.iconSize}px;
	"
>
	{#if db.activeBookmarks}
		{#each db.activeBookmarks as bookmark, i (bookmark.bookmark_id)}
			{#key grid.key}
				<div
					class="cell"
					class:unfocused={search_state.searchValue !== '' && !isRelevant(i)}
					class:focused={search_state.searchValue === '' || isRelevant(i)}
					class:active={i == active}
					class:target={target === i}
					style="
						width: {grid.dimensions.totalItemSize}px;
						height: {grid.iconSize}px;
						transform: {getCellPosition(i)};
						transition: {disableTransitions ? 'none' : `${transitionDuration}ms`};
					"
					bind:this={cells[i]}
				>
					<div
						data-cell={i}
						class="grid-item"
						class:active={active === i}
						draggable="false"
						class:target={target === i}
						class:dragging
						class:disableTransitions
						style="transform: translate({active === i
							? `${move.x}px, ${move.y}px`
							: `0, 0`});"
						onpointerdown={(e) => handleMouseDown(e)}
						onpointerover={() => handleItemMouseOver(i)}
						onpointerout={() => handleItemMouseOut(i)}
						onfocus={() => handleItemMouseOver(i)}
						onblur={() => handleItemMouseOut(i)}
					>
						<div class="grid-image">
							<Bookmark
								{bookmark}
								{hovering}
								{dragging}
								{i}
								onShowBookmarkEditor={() => {
									// todo
									bookmarkEditor.show(['edit', 'bookmark'], i)
								}}
								--size={grid.iconSize + 'px'}
								{disableTransitions}
							/>
						</div>
						{#if showEditIcon[i] && !dragging}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<div
								tabindex="0"
								role="button"
								onpointerover={() => handleItemMouseOver(i)}
								onpointerout={() => handleItemMouseOut(i)}
								onfocus={() => handleItemMouseOver(i)}
								onblur={() => handleItemMouseOut(i)}
								class="edit"
								transition:scale={{ duration: 150 }}
								onclick={(e) => {
									e.preventDefault()
									e.stopPropagation()
									bookmarkEditor.show(['edit', 'bookmark'], i)
								}}
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

		z-index: 3;
		user-select: none;

		&.showGuidelines {
			border: 1px solid color-mix(in srgb, var(--bg-d) 50%, transparent);
			border-bottom: none;
			border-top: none;
		}
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
