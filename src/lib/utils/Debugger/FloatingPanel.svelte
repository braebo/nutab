<script lang="ts">
	import { onMount, tick } from 'svelte'

	export let position = { x: 0, y: 0 }
	export let bounds = { x: 100, y: 100 }
	export let outOfBounds
	// Size of the grabbable border
	export let grabZone = 20
	export let panelWidth = 200
	export let panelHeight = 200

	let panel: Element,
		dragging = false,
		lastPosition,
		boundary = {}
	let innerWidth: number, innerHeight: number

	let inZone = false
	let mouse = { x: 0, y: 0 }
	let dragLock = false

	onMount(() => {
		const { x, y } = panel.getBoundingClientRect()
		position = { x, y }
	})

	// @ts-ignore
	const handleMouseDown = ({ clientX, clientY }) => {
		dragging = inZone
	}
	const handleMouseUp = () => {
		dragging = false
		dragLock = false
		const { x, y } = panel.getBoundingClientRect()
	}

	const handleMouseMove = async (e: MouseEvent) => {
		await tick
		mouse.x = e.clientX
		mouse.y = e.clientY
		const { x, y, width, height } = panel.getBoundingClientRect()
		inZone =
			e.target === panel
				? inRange(mouse.x, x, x + grabZone) ||
				  inRange(mouse.x, x + width - grabZone, x + width) ||
				  inRange(mouse.y, y, y + grabZone) ||
				  inRange(mouse.y, y + height - grabZone, y + height)
				: false
		if ((!dragLock && !inZone) || !dragging) return
		dragLock = true
		const targetPositionY = position.y + e.movementY
		const targetPositionX = position.x + e.movementX
		position.y = Math.max(Math.min(targetPositionY, window.innerHeight - bounds.y), bounds.y - height)
		position.x = Math.max(Math.min(targetPositionX, window.innerWidth - bounds.x), bounds.x - width)
		outOfBounds =
			position.x == bounds.x - width ||
			position.x == window.innerWidth - bounds.x ||
			position.y == bounds.y - height ||
			position.y == window.innerHeight - bounds.y
	}

	function inRange(value: number, min: number, max: number) {
		return value > min && value < max
	}
</script>

<svelte:window on:mouseup={handleMouseUp} on:mousemove={handleMouseMove} bind:innerWidth bind:innerHeight />

<div
	bind:this={panel}
	class="floating-window container"
	on:mousedown={handleMouseDown}
	style="
						transform: translate({position.x}px, {position.y}px);
						box-shadow: 0 0 0 {grabZone}px var(--light-b, black) inset;
						box-sizing: content-box;
						user-select: {dragging ? 'none' : 'auto'};
						width: {panelWidth}px;
						height: {panelHeight}px;
						"
	class:dragging
	class:inZone
>
	<slot />
</div>

<style>
	.container {
		position: absolute;
		display: flex;
		flex-grow: 1;
		align-items: center;
		justify-content: center;

		background: var(--light-b, black);
		border-radius: var(--border-radius, 10px);
		box-shadow: 0 5px 15px 0 var(--light-a, #0003);

		z-index: var(--z-index, 50);
	}
	.inZone {
		cursor: grab;
	}
	.dragging {
		cursor: grabbing;
	}
</style>
