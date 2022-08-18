<script lang="ts">
	import { wait, mouse, screenH, clickOutside, mapRange } from 'fractils'
	import { showSettings, blurOverlay } from '$lib/stores'

	import { tweened, type Tweened } from 'svelte/motion'
	import { quartInOut } from 'svelte/easing'

	export let size = [800, 500]

	let closed = true
	let closing = false

	$: $showSettings ? open() : close()

	/** Settings Panel */
	let p = {
		w: size[0],
		h: size[1],
	}

	const openState = {
		x: 0,
		y: 0,
		rx: 1,
		width: 100,
		height: 100,
	}

	const closedState = {
		x: 45,
		y: 92,
		rx: 8,
		width: 3,
		height: 5,
	}

	// Transition duration for open() and close().
	const dur = 500

	// SVG attributes
	const x = tweened(closedState.x)
	const y = tweened(closedState.y)
	const rx = tweened(closedState.rx)
	const width = tweened(closedState.width)
	const height = tweened(closedState.height)
	const opacity = tweened(0, { duration: 250 })

	let adjust: number

	// Runs on mousemove (maybe debounce this?)
	$: if (closed && !closing) {
		adjust = Math.max(
			// When the mouse drops below the center of the screen, this uses the ratio between
			// the window height and the panel width to grow the circle up to 20% of the
			// final width (closedState.width).
			mapRange($mouse.y, 0 + $screenH / 1.5, $screenH, closedState.width, openState.width * 0.2),

			// Don't allow the circle to shrink below it's starting size.
			closedState.width,
		)

		// Widen the circle as the mouse approaches it.
		width.set(adjust)

		// Keep the circle centered.
		$x = closedState.x - (adjust - closedState.width) * 0.5

		// Inch the radius towards its open state.
		$rx = Math.max(closedState.rx - adjust * 0.75, openState.rx)

		// Fade in the button.
		$opacity = mapRange($mouse.y, $screenH / 2, $screenH / 1.5, 0.2, 0.25)
	} else $opacity = 0.25

	/** current state */
	let s = closedState
	$: s = !closed ? closedState : openState
	/** quarter duration */
	const q = dur / 4
	/** third of a quarter duration */
	const t = q * 0.33

	async function open() {
		closed = false

		tween(width, s.width, q)
		tween(x, s.x, q)

		tween(height, s.height, q, t)
		tween(y, s.y, q, t)

		tween(rx, s.rx)

		await wait(dur / 3)
	}

	async function close() {
		$blurOverlay = false
		closed = true
		closing = true

		tween(width, s.width)
		tween(x, s.x)

		tween(height, s.height)
		tween(y, s.y)

		tween(rx, s.rx, q)

		await wait(dur)
		closing = false
	}

	async function tween(store: Tweened<number>, value: number, duration = dur / 2, delay = 0, easing = quartInOut) {
		if (delay) await wait(delay)
		store.set(value, { delay, duration, easing })
	}
</script>

<div
	class="panel-container"
	style:--width="{p.w}px"
	style:--height="{p.h}px"
	use:clickOutside={{ whitelist: ['.controls', '#inspector', '.grabber'] }}
	on:outclick={() => (!closed ? ($showSettings = false) : void 0)}
>
	<div class="panel">
		<div class="settings">
			{#if $showSettings}
				{#key $showSettings}
					<slot />
				{/key}
			{/if}
		</div>
		<svg class:closed viewBox="0 0 {p.w} {p.h}" width="100%" height="100%">
			<circle cx={p.w - 5} cy={p.w - 5} r={s.rx * 10} fill="white" />
			<g>
				<rect
					x="{$x}%"
					y="{closed ? $y : $y}%"
					rx="{$rx}%"
					width="{$width}%"
					height="{$height}%"
					opacity={$opacity}
					on:click={() => ($showSettings = true)}
				/>
				<text
					x="{43}%"
					y="{$y + 3.3}%"
					font-size="15"
					fill="var(--dark-d)"
					pointer-events="none"
					font-family="var(--font-a)"
					opacity={closed && !closing ? mapRange(adjust, 10, 20, 0, 1) : 0}
				>
					settings
				</text>
			</g>
		</svg>
	</div>
</div>

<style lang="scss">
	.panel-container {
		position: relative;

		width: var(--width);
		min-height: var(--height);
		margin: auto;

		pointer-events: none;
		transform: translateY(calc(var(--height) * -1 - 30px));
	}

	.panel {
		position: absolute;

		height: 100%;
		width: 100%;
		margin: auto;
	}

	.settings {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	svg {
		overflow: visible;
		fill: rgba(var(--light-d-rgb), 0.4);
		backface-visibility: hidden;
		backdrop-filter: blur(10px);
		box-shadow: 0 10px 50px 0px rgba(29, 29, 29, 0.04), 0 6px 20px 5px rgba(29, 29, 29, 0.01);

		transition: backdrop-filter 0.5s;
		transition-delay: 0.5s;

		&.closed {
			backdrop-filter: blur(0px);
			box-shadow: 0 10px 50px 0px rgba(29, 29, 29, 0), 0 6px 20px 5px rgba(29, 29, 29, 0);
			transition-delay: 0s;
			transition-duration: 0.05s;

			& rect {
				pointer-events: all;
				cursor: pointer;
			}
		}
	}
</style>
