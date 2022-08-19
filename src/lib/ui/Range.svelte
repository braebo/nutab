<!-- 
	@component
	A custom range input slider component.
	
	@prop `value: any` - The value to be controled by the slider.
	@prop `range: { min: number, max: number }` - The range of the slider.
	@prop `name: string` - The name of the value for its label.
	@prop `step: number` - The amount to increment each change.
	@prop `vertical?: boolean` - The amount to increment each change.
 -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { mapRange } from 'fractils'
	import { onDestroy } from 'svelte'

	const dispatch = createEventDispatcher()

	/** The value to be controled by the slider. */
	export let value: any
	export let name: string
	export let range: { min: number; max: number }
	export let vertical = false
	// export let step = 0.1 // TODO

	const { min, max } = range

	let el: HTMLElement
	let track: HTMLElement
	let thumb: HTMLElement
	let dragging = false
	const thumbWidth = 12
	$: clientWidth = el?.clientWidth ?? 100
	$: progress = mapRange(value, min, max, 1, clientWidth - thumbWidth)

	/*
	 * Used to calculate progress when clicking the track (as opposed to dragging the thumb).
	 */
	const setFromMouse = (e: MouseEvent) => {
		if (!el) return
		const mouse = vertical ? e.clientY : e.clientX
		const { left } = el.getBoundingClientRect()
		const relativeX = mouse - left

		const normalizedProgress = mapRange(relativeX, 0, el.clientWidth, 0, 100)

		value = Math.trunc(mapRange(normalizedProgress, 0, 100, min, max))

		// Continue in case this is a drag operation
		mouseDown()
	}

	const mouseUp = () => {
		dragging = false

		window.addEventListener('mousemove', mouseMove)

		el.style.cursor = 'pointer'
		track.style.cursor = 'pointer'
		thumb.style.cursor = 'grab'
	}

	const mouseDown = () => {
		dragging = true

		window.addEventListener('mouseup', mouseUp, { once: true })
		window.addEventListener('mousemove', mouseMove)

		el.style.cursor = 'grabbing'
		el.parentElement.style.cursor = 'grabbing'
		track.style.cursor = 'grabbing'
		thumb.style.cursor = 'grabbing'
	}

	const mouseMove = (e: MouseEvent) => {
		if (!dragging || !el) return

		value += Math.trunc(e.movementX * ((1 / clientWidth) * (max - min)))

		if (value < min) value = min
		if (value > max) value = max

		dispatch('input', { name, value })
	}

	onDestroy(() => {
		window.removeEventListener('mousemove', mouseMove)
		window.removeEventListener('mouseup', mouseUp)
	})
</script>

<div
	class="range"
	class:vertical
	role="slider"
	{name}
	bind:this={el}
	on:mousedown={setFromMouse}
	style:--thumb-width="{thumbWidth}px"
	draggable="false"
>
	<div
		class="thumb"
		bind:this={thumb}
		on:mousedown|stopPropagation|capture={mouseDown}
		style:left="{progress}px"
		draggable="false"
	/>
	<div class="track" bind:this={track} style:clip-path="0 {progress} 0 0" draggable="false" />
</div>

<style lang="scss">
	.range {
		position: relative;
		display: flex;

		width: 100%;

		background: none;

		&:focus {
			outline: none;
		}
	}

	.track {
		width: 100%;
		height: 15px;

		border: 0.2px solid var(--light-a);
		border-radius: 50px;
		background: var(--light-b);

		cursor: pointer;
	}

	.thumb {
		position: absolute;
		top: 0;
		bottom: 0;
		margin: auto;

		width: var(--thumb-width);
		height: var(--thumb-width);

		border: 1px solid var(--light-a);
		border-radius: 20px;
		background: var(--light-d);

		cursor: grab;
		transition: background 0.3s;
		appearance: none;
		appearance: none;

		&:focus::-webkit-slider-thumb {
			background: var(--brand-a);
		}
	}
</style>
