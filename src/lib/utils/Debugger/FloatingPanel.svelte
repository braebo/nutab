<script lang="ts">
	import { onMount, tick } from 'svelte'

	interface Props {
		position?: { x: number; y: number }
		bounds?: { x: number; y: number }
		outOfBounds?: boolean
		/**
		 * Size of the grabbable border
		 */
		grabZone?: number
		panelWidth?: number
		panelHeight?: number
		children?: import('svelte').Snippet
	}

	let {
		position = $bindable({ x: 0, y: 0 }),
		bounds = { x: 100, y: 100 },
		outOfBounds = $bindable(),
		grabZone = 20,
		panelWidth = 200,
		panelHeight = 200,
		children,
	}: Props = $props()

	let panel = $state<HTMLElement>()
	let dragging = $state(false)
	let innerWidth = $state<number>()
	let innerHeight = $state<number>()

	let inZone = $state(false)
	let mouse = { x: 0, y: 0 }
	let dragLock = false

	onMount(() => {
		const { x, y } = panel!.getBoundingClientRect()
		position = { x, y }
	})

	const handleMouseDown = () => {
		dragging = inZone
	}
	const handleMouseUp = () => {
		dragging = false
		dragLock = false
	}

	const handleMouseMove = async (e: PointerEvent) => {
		await tick()
		mouse.x = e.clientX
		mouse.y = e.clientY
		const { x, y, width, height } = panel!.getBoundingClientRect()
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
		position.y = Math.max(
			Math.min(targetPositionY, window.innerHeight - bounds.y),
			bounds.y - height,
		)
		position.x = Math.max(
			Math.min(targetPositionX, window.innerWidth - bounds.x),
			bounds.x - width,
		)
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

<svelte:window
	onpointerup={handleMouseUp}
	onpointermove={handleMouseMove}
	bind:innerWidth
	bind:innerHeight
/>

<div
	bind:this={panel}
	class="floating-window container"
	onpointerdown={handleMouseDown}
	style="
						transform: translate({position.x}px, {position.y}px);
						box-shadow: 0 0 0 {grabZone}px var(--fg-b, black) inset;
						box-sizing: content-box;
						user-select: {dragging ? 'none' : 'auto'};
						width: {panelWidth}px;
						height: {panelHeight}px;
						"
	class:dragging
	class:inZone
>
	{@render children?.()}
</div>

<style>
	.container {
		position: absolute;
		display: flex;
		flex-grow: 1;
		align-items: center;
		justify-content: center;

		background: var(--fg-b, black);
		border-radius: var(--border-radius, 10px);
		box-shadow: 0 5px 15px 0 var(--fg-a, #0003);

		z-index: var(--z-index, 50);
	}
	.inZone {
		cursor: grab;
	}
	.dragging {
		cursor: grabbing;
	}
</style>
