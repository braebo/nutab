<!-- 
	@component
	A custom range input slider component.
	
	@prop `value: any` - The value to be controled by the slider.
	@prop `range: { min: number, max: number }` - The range of the slider.
	@prop `name: string` - The name of the value for its label.
	@prop `step: number` - The amount to increment each change.
	@prop `vertical?: boolean` - The amount to increment each change.
	@prop `truncate?: boolean` - Rounds decimals into whole numbers.
 -->
<script lang="ts">
	import { mapRange } from 'fractils'
	import { onDestroy } from 'svelte'
	import { tick } from 'svelte'

	interface Props {
		/** The value to be controled by the slider. */
		value: any
		name: string
		range: { min: number; max: number }
		vertical?: boolean
		step?: number
		truncate?: boolean
		oninput?: (e: Event) => void
	}

	let {
		value = $bindable(),
		name,
		range,
		vertical = false,
		step = 0.0001,
		truncate = false,
	}: Props = $props()

	const { min, max } = range

	let el = $state<HTMLElement>()
	let track = $state<HTMLElement>()
	let thumb = $state<HTMLElement>()
	let dragging = false
	const thumbWidth = 12
	let clientWidth = $derived(el?.clientWidth ?? 100)
	let progress = $derived(mapRange(value, min, max, 1, clientWidth - thumbWidth))

	// Used to store the last value of the slider before it's truncated.
	let targetValue = value

	/**
	 * Used to calculate progress when clicking the track (as opposed to dragging the thumb).
	 */
	const setFromMouse = (e: MouseEvent) => {
		if (!el) return
		// const mouse = vertical ? e.clientY : e.clientX
		const mouse = e.clientX
		const { left } = el.getBoundingClientRect()
		const relativeX = mouse - left
		console.log({ relativeX })

		const normalizedProgress = mapRange(relativeX, 0, el.clientWidth, 0, 100)

		targetValue = mapRange(normalizedProgress, 0, 100, min, max)
		updateValue(targetValue)

		// Continue in case this is a drag operation
		mouseDown()
	}

	const mouseUp = () => {
		dragging = false

		window.addEventListener('mousemove', mouseMove)

		el && (el.style.cursor = 'pointer')
		track && (track.style.cursor = 'pointer')
		thumb && (thumb.style.cursor = 'grab')
	}

	const mouseDown = () => {
		dragging = true

		window.addEventListener('mouseup', mouseUp, { once: true })
		window.addEventListener('mousemove', mouseMove)

		el && (el.style.cursor = 'grabbing')
		el?.parentElement && (el.parentElement.style.cursor = 'grabbing')
		track && (track.style.cursor = 'grabbing')
		thumb && (thumb.style.cursor = 'grabbing')
	}

	const { performance } = globalThis
	let last = performance.now()
	const mouseMove = async (e: MouseEvent) => {
		if (!dragging || !el) return
		await tick()
		e.preventDefault()

		targetValue += e.movementX * ((1 / clientWidth) * (max - min))

		if (targetValue < min) targetValue = min
		if (targetValue > max) targetValue = max

		const now = performance.now()
		if (now > last + 1) {
			updateValue(targetValue)
		}
		last = now
	}

	const updateValue = (v: number) => {
		if (truncate) v = Math.round(v)
		if (Math.abs(targetValue - value) > step) value = v
	}

	onDestroy(() => {
		window.removeEventListener('mousemove', mouseMove)
		window.removeEventListener('mouseup', mouseUp)
	})
</script>

<div
	class="range"
	tabindex="0"
	class:vertical
	role="slider"
	aria-label={name}
	aria-valuenow={value}
	bind:this={el}
	onmousedown={setFromMouse}
	style:--thumb-width="{thumbWidth}px"
	draggable="false"
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="thumb"
		bind:this={thumb}
		onmousedown={(e) => {
			e.stopPropagation()
			mouseDown()
		}}
		style:left="{progress}px"
		draggable="false"
	></div>
	<div class="track" bind:this={track} style:clip-path="0 {progress} 0 0" draggable="false"></div>
</div>

<style lang="scss">
	.range {
		position: relative;
		display: flex;

		width: 100%;

		background: none;

		user-select: none;

		&:focus {
			outline: none;
		}
		&:hover .track {
			border-color: var(--fg-d);
		}
	}

	.track {
		width: 100%;
		height: 15px;

		border: 0.2px solid var(--fg-c);
		border-radius: 50px;
		background: var(--fg-b);

		cursor: pointer;
		transition: 200ms;
	}

	.thumb {
		position: absolute;
		top: 0;
		bottom: 0;
		margin: auto;

		width: var(--thumb-width);
		height: var(--thumb-width);

		border: 1px solid var(--bg-d);
		border-radius: 20px;
		background: var(--bg-a);

		cursor: grab;
		transition: background 0.3s;
		appearance: none;
		appearance: none;

		&:focus::-webkit-slider-thumb {
			background: var(--theme-a);
		}
	}
</style>
