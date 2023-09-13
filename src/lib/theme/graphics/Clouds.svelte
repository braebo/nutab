<script lang="ts">
	import { fly } from 'svelte/transition'

	export let size = 35
	export let t_in = { x: -size, duration: 3000 }
	export let t_out = { x: -size, duration: 6000, opacity: 1 }
</script>

<div class="container" style="width: {size}px;" in:fly|global={t_in} out:fly={t_out}>
	<svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" overflow="visible">
		<circle x="5" y="5" r="2.5" fill="url(#CloudGradient1)" filter="url(#CloudFilter)" />
		<defs>
			<filter
				id="CloudFilter"
				x="0"
				y="0"
				width="3100%"
				height="300%"
				filterUnits="objectBoundingBox"
				primitiveUnits="userSpaceOnUse"
				color-interpolation-filters="linearRGB"
			>
				<feTurbulence
					type="turbulence"
					baseFrequency="0.1 0.2"
					numOctaves="10"
					seed="4"
					stitchTiles="noStitch"
					result="turbulence"
				>
					<animate
						attributeName="baseFrequency"
						values="0.05 0.1;0.1 0.5;0.05 0.1"
						repeatCount="indefinite"
						dur="100s"
					/>
				</feTurbulence>
				<feDisplacementMap
					in="SourceGraphic"
					in2="turbulence"
					scale="20"
					xChannelSelector="G"
					yChannelSelector="A"
					result="displacementMap"
				/>
			</filter>
			<radialGradient id="CloudGradient1">
				<stop offset="0" stop-color="#FDBF" />
				<stop offset="0.2" stop-color="#FEBE" />
				<stop offset=".5" stop-color="#FFFD" />
				<stop offset="1" stop-color="#FFF0" />
			</radialGradient>
			<radialGradient id="CloudGradient2">
				<stop offset="0" stop-color="#BBB" />
				<stop offset=".8" stop-color="#FFF" />
				<stop offset="1" stop-color="#FFF0" />
			</radialGradient>
		</defs>
	</svg>
</div>

<style>
	.container {
		position: absolute;
		z-index: 10;
		inset: 0;
	}
	* {
		backface-visibility: hidden;
	}
	div {
		backface-visibility: hidden;
	}
	@keyframes wind {
		from {
			transform: translateX(-50%);
		}
		to {
			transform: translateX(50%);
		}
	}
</style>
