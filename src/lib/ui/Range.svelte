<script lang="ts">
	import { mapRange } from 'fractils'
	import { onDestroy } from 'svelte'

	export let setting: any, name: string, range
	const { min, max } = range as { min: number; max: number }

	let el: HTMLElement
	let dragging = false
	const thumbWidth = 12
	$: clientWidth = el?.clientWidth ?? 100
	$: progress = mapRange(setting, min, max, 1, clientWidth - thumbWidth)

	const mouseUp = () => {
		dragging = false
		window.addEventListener('mousemove', mouseMove)
	}

	const mouseDown = () => {
		dragging = true
		window.addEventListener('mouseup', mouseUp, { once: true })
		window.addEventListener('mousemove', mouseMove)
	}

	const mouseMove = (e: MouseEvent) => {
		if (!dragging || !el) return
		setting += e.movementX * ((1 / clientWidth) * (max - min))
		if (setting < min) setting = min
		if (setting > max) setting = max
	}

	onDestroy(() => {
		window.removeEventListener('mousemove', mouseMove)
		window.removeEventListener('mouseup', mouseUp)
	})
</script>

<div {name} class="range" {min} {max} on:change on:input bind:this={el} style:--thumb-width="{thumbWidth}px">
	<div class="thumb" style:left="{progress}px" max="100" on:mousedown={mouseDown} />
	<div class="progress" style:clip-path="0 {progress} 0 0" max="100" />
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

	.progress {
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
		background: var(--dark-d);
		background-image: radial-gradient(ellipse at var(--progress) var(--progress), blue, red);

		cursor: pointer;
		transition: background 0.3s;
		appearance: none;
		appearance: none;

		&:focus::-webkit-slider-thumb {
			background: var(--brand-a);
		}
	}
</style>
