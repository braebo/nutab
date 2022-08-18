<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { mapRange } from 'fractils'
	import { onDestroy } from 'svelte'

	const dispatch = createEventDispatcher()

	export let setting: any, name: string, range
	const { min, max } = range as { min: number; max: number }

	let el: HTMLElement
	let track: HTMLElement
	let thumb: HTMLElement
	let dragging = false
	const thumbWidth = 12
	$: clientWidth = el?.clientWidth ?? 100
	$: progress = mapRange(setting, min, max, 1, clientWidth - thumbWidth)

	const setFromMouseX = (e: MouseEvent) => {
		if (!el) return
		const { clientX } = e
		const { clientWidth } = el
		const { left } = el.getBoundingClientRect()
		const relativeX = clientX - left
		// const normalized = (clientX - offset) / width
		const normalizedProgress = mapRange(relativeX, 0, clientWidth, 0, 100)
		setting = mapRange(normalizedProgress, 0, 100, min, max)
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

		setting += e.movementX * ((1 / clientWidth) * (max - min))

		if (setting < min) setting = min
		if (setting > max) setting = max

		dispatch('input', { name, setting })
	}

	onDestroy(() => {
		window.removeEventListener('mousemove', mouseMove)
		window.removeEventListener('mouseup', mouseUp)
	})
</script>

<div
	class="range"
	{name}
	bind:this={el}
	style:--thumb-width="{thumbWidth}px"
	draggable="false"
	on:mousedown={setFromMouseX}
>
	<div class="thumb" bind:this={thumb} style:left="{progress}px" draggable="false" on:mousedown={mouseDown} />
	<div class="track" bind:this={track} style:clip-path="0 {progress} 0 0" draggable="false" />
</div>

<style lang="scss">
	.range {
		position: relative;
		display: flex;

		width: 100%;
		max-width: 80%;
		margin: 18px 0;

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
