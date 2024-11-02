<script lang="ts">
	import { activeSection } from '$lib/stores/activeSection.svelte'
	import { blurOverlay } from '$lib/stores/blurOverlay.svelte'
	import { settings } from '$lib/stores/settings.svelte'
	import { device } from '$lib/stores/device.svelte'

	import { clickOutside } from '$lib/utils/clickOutside'
	import { mapRange } from '$lib/utils/mapRange'
	import { click } from '$lib/utils/onClick'
	import { wait } from '$lib/utils/wait'

	import { tweened, type Tweened } from 'svelte/motion'
	import { quartInOut } from 'svelte/easing'
	import { fade } from 'svelte/transition'
	import { untrack } from 'svelte'

	interface Props {
		size?: any
		children?: import('svelte').Snippet
	}

	let { size = [700, 400], children }: Props = $props()

	let closed = $state(true)
	let closing = $state(false)

	/** Settings Panel */
	let panel = {
		w: size[0],
		h: size[1],
		open: {
			x: 0,
			y: 0,
			rx: 1,
			width: 100,
			height: 100,
		},
		closed: {
			x: 45,
			y: 92,
			rx: 8,
			width: 4,
			height: 7,
		},
	}

	/** Transition duration for open() and close(). */
	const dur = 500

	// SVG attributes
	const x = tweened(panel.closed.x)
	const y = tweened(panel.closed.y)
	const rx = tweened(panel.closed.rx)
	const width = tweened(panel.closed.width)
	const height = tweened(panel.closed.height)
	const opacity = tweened(0, { duration: 250 })

	// Circle offset
	let offset: number = $state(panel.closed.width)

	/** current state */
	let current = $derived(closed ? panel.closed : panel.open)
	/** quarter duration */
	const q = dur / 4
	/** third of a quarter duration */
	const t = q * 0.33

	async function open() {
		closed = false

		tween(width, current.width, q)
		tween(x, current.x, q)

		tween(height, current.height, q, t)
		tween(y, current.y, q, t)

		tween(rx, current.rx)

		await wait(dur / 3)
	}

	async function close() {
		blurOverlay.value = false
		closed = true
		closing = true

		tween(width, current.width)
		tween(x, current.x)

		tween(height, current.height)
		tween(y, current.y)

		tween(rx, current.rx, q)

		await wait(dur)
		closing = false

		offset = panel.closed.width
	}

	async function tween(
		store: Tweened<number>,
		value: number,
		duration = dur / 2,
		delay = 0,
		easing = quartInOut,
	) {
		if (delay) await wait(delay)
		store.set(value, { delay, duration, easing })
	}
	$effect(() => {
		settings.showSettings ? open() : close()
	})
	// Runs on mousemove (maybe debounce this?)
	$effect(() => {
		device.mouse.x
		device.mouse.y
		untrack(() => {
			if (closed && !closing) {
				offset = Math.max(
					// When the mouse drops below the center of the screen, this uses the ratio between
					// the window height and the panel width to grow the circle up to 20% of the
					// final width (closedState.width).
					mapRange(
						device.mouse.y,
						0 + device.height / 1.5,
						device.height,
						panel.closed.width,
						panel.open.width * 0.2,
					),

					// Don't allow the circle to shrink below it's starting size.
					panel.closed.width,
				)

				// Widen the circle as the mouse approaches it.
				width.set(offset)

				// Keep the circle centered.
				x.set(panel.closed.x - (offset - panel.closed.width) * 0.5)

				// Inch the radius towards its open state.
				rx.set(Math.max(panel.closed.rx - offset * 0.75, panel.open.rx))

				// Fade in the button.
				opacity.set(
					mapRange(device.mouse.y, device.height / 2, device.height / 1.5, 0.2, 0.25),
				)
			} else {
				opacity.set(0.25)
			}
		})
	})
</script>

{#if activeSection.value === 'bookmarks'}
	<div
		class="panel-container"
		style:--width="{panel.w}px"
		style:--height="{panel.h}px"
		use:clickOutside={{ whitelist: ['controls', 'nub', 'grabber', 'theme-toggle'] }}
		onoutclick={() => {
			if (!closed) settings.showSettings = false
		}}
		transition:fade
	>
		<div class="panel">
			<div class="settings">
				{#if settings.showSettings}
					{#key settings.showSettings}
						{@render children?.()}
					{/key}
				{/if}
			</div>
			<svg class:closed viewBox="0 0 {panel.w} {panel.h}" width="100%" height="100%">
				<circle cx={panel.w - 5} cy={panel.w - 5} r={current.rx * 10} fill="white" />
				<g>
					<rect
						use:click
						x="{$x}%"
						y="{closed ? $y : $y}%"
						rx="{$rx}%"
						width="{$width}%"
						height="{$height}%"
						opacity={$opacity}
						onClick={() => (settings.showSettings = true)}
						stroke="var(--fg-d)"
						stroke-width="1.5"
					/>
					<text
						x="{42.75}%"
						y="{$y + 4.5}%"
						font-size="15"
						fill="var(--bg-d)"
						pointer-events="none"
						font-family="var(--font-a)"
						opacity={closed && !closing ? mapRange(offset, 10, 20, 0, 1) : 0}
					>
						settings
					</text>
				</g>
			</svg>
		</div>
	</div>
{/if}

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
		fill: color-mix(in srgb, var(--fg-a) 95%, transparent);
		background: color-mix(in srgb, var(--fg-a) 50%, transparent);
		backface-visibility: hidden;
		border-radius: var(--radius);
		backdrop-filter: blur(20px);
		box-shadow:
			0 10px 50px 0px rgba(29, 29, 29, 0.04),
			0 6px 20px 5px rgba(29, 29, 29, 0.01);

		transition:
			backdrop-filter 0.5s,
			box-shadow 0.5s,
			background 0.5s;

		&.closed {
			backdrop-filter: blur(0px);
			box-shadow:
				0 10px 50px 0px rgba(29, 29, 29, 0),
				0 6px 20px 5px rgba(29, 29, 29, 0);
			transition-duration: 0.05s;
			background: color-mix(in srgb, var(--fg-d) 0%, transparent);

			rect {
				pointer-events: all;
				cursor: pointer;
				outline: none;
			}
		}
	}
</style>
