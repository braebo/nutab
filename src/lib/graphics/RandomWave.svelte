<script lang="ts">
	import { randomRange } from './randomRange'
	import { randomColor } from '$lib/utils'

	let defaults = [
		{
			id: 'spread',
			min: 0,
			max: 200,
		},
		{
			id: 'bend',
			min: -500,
			max: 0,
		},
		{
			id: 'mid',
			min: -500,
			max: 50,
		},
		{
			id: 'peak',
			min: 100,
			max: 300,
		},
		{
			id: 'cross',
			min: 0,
			max: 500,
		},
	]

	function randomInt(min: number, max: number) {
		return Math.random() * (max - min) + min
	}

	const c = defaults.map((x) => randomRange(x.min, x.max))

	const color = randomColor()
</script>

<div id="top-half">
	<svg viewBox="0 0 500 150" preserveAspectRatio="none">
		<path fill={color} d="M{c[1]},{c[0]} C{c[2]},{c[3]} {c[4]},-{c[0]} 500.00,{c[0]} L500.00,0.00 L0.00,0.00 Z" />
	</svg>
</div>
<div id="bottom-half">
	<svg viewBox="0 0 500 150" preserveAspectRatio="none">
		<path fill={color} d="M{c[1]},{c[0]} C{c[2]},{c[3]} {c[4]},-{c[0]} 500.00,{c[0]} L800.00,0.00 L0.00,0.00 Z" />
	</svg>
</div>

<style>
	svg {
		background: transparent;
		transform: translateY(-0.1rem);
		position: relative;
		overflow: hidden;
		height: 100%;
		width: 100%;
	}

	#top-half {
		transform: rotate(180deg);
	}
	#bottom-half {
		transform: translateY(3px) rotate(0deg);
	}

	path {
		stroke: none;
		transition: 1s all ease-out;
	}
</style>
