<script lang="ts">
	import { grid, gridDimensions } from './_lib/gridGenerator'
	import DebugPanel from './_lib/DebugPanel.svelte'
	import { gradient } from './_lib/utils'
	import { mouse } from 'fractils'

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
		// Make sure we have a active first
		if (active === null) return
		else dragging = true

		// Store index of target cell
		if (e.target.classList[0]?.split('-')[1] != null) {
			let targetIndex = parseInt(e.target.classList[0]?.split('-')[1])
			target = targetIndex

			// If our target cell has changed
			if (lastTarget != null && lastTarget != target) {
				console.log('new target')
				// go back to original position
				positionProxy[lastTarget] = null
			}
			// If the target cell isn't the current active
			if (target != active) {
				// Move it to our active's cell position
				positionProxy[target] = positions[active]
			}
			lastTarget = target
			if (target == active) {
				// we have returned to the original position
				positionProxy = positionProxy.fill(null)
			}
		}
		// Update movement vector
		move.x += e.movementX
		move.y += e.movementY
		//// Swap active and target cells
		// positionProxy = [...positions]
		// positionProxy[active] = positionProxy[target]
		// positionProxy[target] = positions[active]
		// Move target cell to active cell position
	}
	if (active && target) {
		$grid.items[active]
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
				"
			bind:this={cells[i]}
		>
			<!-- left: {active != i ? (positionProxy ? positionProxy[i]?.x : positions[i]?.x) : positions[i]?.x}px;
				top: {active != i ? (positionProxy ? positionProxy[i]?.y : positions[i]?.y) : positions[i]?.y}px; -->
			<div
				class="item-{i} grid-item"
				class:active={active === i}
				class:target={target === i}
				style="transform: translate({dragging && active === i ? `${move.x}px, ${move.y}px` : 0})"
				draggable="false"
			>
				<div class="grid-image" style="background-image: url({g?.image});" draggable="false" />
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

		transition: 0.25s;

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
</style>
