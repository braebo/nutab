<script lang="ts">
	import { grid, gridDimensions } from './_lib/gridGenerator'
	import DebugPanel from './_lib/DebugPanel.svelte'
	import { gradient } from './_lib/utils'
	import { mouse } from 'fractils'

	let dragging = false
	let target: number = null
	let destination: number = null
	let lastDestination: number = null
	let move = { x: 0, y: 0 }
	let positions = $gridDimensions.positions
	let positionProxy = Array(positions.length).fill(null)
	let cells: HTMLElement[] = []

	const handleMouseUp = (e: MouseEvent) => {
		dragging = false
		target = null
		destination = null
		lastDestination = null
		move = { x: 0, y: 0 }
		positionProxy.fill(null)
	}

	const handleMouseDown = (e: MouseEvent) => {
		// Store index of target cell
		const targetClass = e.target.classList[0]
		if (targetClass?.startsWith('item-')) {
			target = parseInt(targetClass.split('-')[1])
		}
	}

	const handleMouseMove = (e: MouseEvent) => {
		// Make sure we have a target first
		if (target != null) {
			if (!dragging) dragging = true
			// Store index of destination cell
			if (e.target.classList[0]?.split('-')[1] != null) {
				let destinationIndex = parseInt(e.target.classList[0]?.split('-')[1])
				destination = destinationIndex
				// cells[target].style.left = `${destination.x}px`
				// cells[target].style.top = `${destination.y}px`
				// if (lastDestination.index != destination && lastDestination.el) {
				// 	console.log('putting back')
				// 	console.log(lastDestination.el)
				// 	lastDestination.el.style.left = `${positions[lastDestination.index].x}px`
				// 	lastDestination.el.style.top = `${positions[lastDestination.index].y}px`
				// }
				if (lastDestination && lastDestination != destination) {
					console.log('new destination')
					if (lastDestination) {
					}
				}
				if (destination != target) {
					lastDestination = destinationIndex
					console.log('updated')
					positionProxy[destinationIndex] = positions[target]
					cells[lastDestination].style.transform = `translate(${positions[target].x}px, ${positions[target].y}px)`
					// cells[lastDestination].style.top = `${positions[target].y}px`
				}
			}
			// Update movement vector
			move.x += e.movementX
			move.y += e.movementY
			//// Swap target and destination cells
			// positionProxy = [...positions]
			// positionProxy[target] = positionProxy[destination]
			// positionProxy[destination] = positions[target]
			// Move destination cell to target cell position
		}
		if (target && destination) {
			$grid.items[target]
		}
	}
</script>

<DebugPanel />

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
			style="
				/* stylelint-disable */
				border: 1px solid {gradient(i, $grid.items.length)};
				width: {$gridDimensions.totalItemSize}px;
				height: {$gridDimensions.totalItemSize}px;
				transform: translate({target != i ? (positionProxy[i] != null ? positionProxy[i]?.x : positions[i]?.x) : positions[i]?.x}px, {target != i
				? positionProxy[i] != null
					? positionProxy[i]?.y
					: positions[i]?.y
				: positions[i]?.y}px);
				"
			bind:this={cells[i]}
		>
			<!-- left: {target != i ? (positionProxy ? positionProxy[i]?.x : positions[i]?.x) : positions[i]?.x}px;
				top: {target != i ? (positionProxy ? positionProxy[i]?.y : positions[i]?.y) : positions[i]?.y}px; -->
			<div
				class="item-{i} grid-item"
				class:target={target === i}
				class:destination={destination === i}
				style="transform: translate({dragging && target === i ? `${move.x}px, ${move.y}px` : 0})"
				draggable="false"
			>
				<div class="grid-image" style="background-image: url({g?.image});" draggable="false" />
			</div>
		</div>
	{/each}
</div>
<center>
	dragging: {dragging}
	<br />
	target: {JSON.stringify(target)}
	<br />
	destination: {JSON.stringify(destination)}
	<br />
	<pre>lastDestination: {JSON.stringify(lastDestination, null, 2)}</pre>
	<br />
	positionProxy:
	{#each positionProxy as p}
		<pre>{p}</pre>
	{/each}
</center>

<style lang="scss">
	.grid {
		position: relative;

		width: var(--grid-width);
		height: var(--grid-height);
		margin: 1vh auto;

		border: 1px solid gray;
		box-sizing: content-box;

		z-index: 10;
		user-select: none;
	}
	.cell {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;

		transition: 0.25s;
	}
	.grid-item {
		width: var(--item-size);
		height: var(--item-size);
		margin: auto;

		color: white;

		cursor: pointer;
		pointer-events: all;

		transition: 0.2s ease-in-out;

		&.target {
			background: rgba(150, 255, 200, 0.25);

			pointer-events: none;
			z-index: 10;

			transition: none;

			// transition: none;
		}

		&.destination:not(.target) {
			background: rgba(250, 155, 200, 0.25);
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
