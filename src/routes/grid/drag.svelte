<script lang="ts">
	import { grid, gridDimensions } from './_lib/gridGenerator'
	import DebugPanel from './_lib/DebugPanel.svelte'
	import { gradient } from './_lib/utils'
	import { onMount } from 'svelte'

	let dragging = false
	// the element to drag
	let active: number = null
	// the element to swap with
	let target: number = null
	let lastTarget: number = null
	// mouse movement for dragging active element
	let move = { x: 0, y: 0 }
	// the positions of each grid cell
	let positions = $gridDimensions.positions
	// temporary positions for animations while dragging
	let positionProxy = Array(positions.length).fill(null)
	// a ref to each cell
	let cells: HTMLElement[] = []
	// cell transition animation duration in ms
	const transitionDuration = 250
	// a ref to each cell's image
	let images: HTMLElement[] = []
	// temporarily disables target detection
	let cooldown = false

	const handleMouseUp = (e: MouseEvent) => {
		// reset all the things
		dragging = false
		active = null
		target = null
		lastTarget = null
		move = { x: 0, y: 0 }
		positionProxy = positionProxy.fill(null)
	}

	const handleMouseDown = (e: MouseEvent) => {
		// Store index of active cell
		const activeClass = e.target.classList[0]
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
		if (!cooldown && e.target.classList[0]?.split('-')[1] != null) {
			// Store the target cell's index
			target = parseInt(e.target.classList[0]?.split('-')[1])
			// If our target cell has changed
			if (lastTarget != null && lastTarget != target) {
				// go back to original position
				positionProxy[lastTarget] = null
			}
			// If the target cell isn't the current active
			if (target != active) {
				// Move it to our active's cell position
				positionProxy[target] = positions[active]
			}
			if (target == active) {
				// we have returned to the original position
				positionProxy = positionProxy.fill(null)
			}
			// update lastTarget
			lastTarget = target

			// apply cooldown to avoid jank
			setCooldown()
		}
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
			return `translate(${positions[i].x}px, ${positions[i].y}px)`
		}
	}

	let debug = false
</script>

{#if debug}
	<DebugPanel />
{/if}

<svelte:window on:mousedown={handleMouseDown} on:mouseup={handleMouseUp} on:mousemove={handleMouseMove} />

<div
	class="grid"
	class:dragging
	style="
		--item-size: {$grid.itemSize}px;
		--grid-width: {$grid.gridWidth}px;
		--grid-height: {$gridDimensions.gridHeight}px;
	"
>
	{#each $grid.items as g, i}
		<div
			class="cell-{i} cell"
			class:active={i == active}
			class:target={target === i}
			style="
				/* stylelint-disable */
				border: {debug ? `1px solid ${gradient(i, $grid.items.length)}` : 'none'};
				width: {$gridDimensions.totalItemSize}px;
				height: {$gridDimensions.totalItemSize}px;
				transform: {getCellPosition(i)};
				transition: {transitionDuration}ms;
				"
			bind:this={cells[i]}
		>
			<div
				class="item-{i} grid-item"
				class:active={active === i}
				class:target={target === i}
				style="transform: translate({dragging && active === i ? `${move.x}px, ${move.y}px` : `0, 0`})"
				draggable="false"
				class:dragging
			>
				<div
					class="grid-image"
					style="background-image: url({g?.image});"
					draggable="false"
					bind:this={images[i]}
				/>
			</div>
		</div>
	{/each}
</div>

{#if debug}
	<center>
		dragging: {dragging}
		<br />
		active: {JSON.stringify(active)}
		<br />
		target: {JSON.stringify(target)}
		<br />
		lastTarget: {JSON.stringify(lastTarget)}
		<br />
		positionProxy:
		{#each positionProxy as p}
			<pre>{p}</pre>
		{/each}
	</center>
{/if}

<style lang="scss">
	.grid {
		position: relative;

		width: var(--grid-width);
		height: var(--grid-height);
		margin: 1vh auto;

		box-sizing: content-box;

		z-index: 1;
		user-select: none;

		&.debug {
			border: 1px solid gray;
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

			&.debug {
				background: rgba(150, 255, 200, 0.25);
			}
		}

		&.target:not(.active) {
			&.debug {
				background: rgba(250, 155, 200, 0.25);
			}

			z-index: -1;
		}
	}
	.grid-image {
		width: 100%;
		height: 100%;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;

		pointer-events: none;
	}
	.dragging {
		cursor: grabbing;
	}
</style>
