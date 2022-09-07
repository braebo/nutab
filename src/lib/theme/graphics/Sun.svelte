<script>
	export let size = 100
	let radius = 2.5
</script>

<div class="container" style="width: {size}px;">
	<svg width="100%" height="100%" viewBox="-5 -5 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle x="5" y="5" r={radius} fill="url(#SunGradient)" />
		<circle x="5" y="5" r={radius * 2} fill="url(#SunGlow)" />
		<defs>
			<radialGradient id="SunGradient">
				<stop offset="0.6" stop-color="#FD0">
					<animate
						attributeName="stop-color"
						values="#FD0;#FA0;#FD0"
						dur="10s"
						repeatCount="indefinite"
						autoReverse="true"
					/>
				</stop>
				<stop offset="0.95" stop-color="#FD0">
					<animate
						attributeName="stop-color"
						values="#FD0;#ff1;#FD0"
						dur="7s"
						repeatCount="indefinite"
						autoReverse="true"
					/>
				</stop>
				<stop offset="1" stop-color="#ff12">
					<animate
						attributeName="stop-color"
						values="#ff10;#ff10;#ff10"
						dur="6s"
						repeatCount="indefinite"
						autoReverse="true"
					/>
				</stop>
			</radialGradient>
			<radialGradient id="SunGlow">
				<stop offset="0" stop-color="#ff1" transform="scale(2)">
					<animate
						attributeName="stop-color"
						values="#ff13;#ff11;#ff13"
						dur="6s"
						repeatCount="indefinite"
						autoReverse="true"
					/>
				</stop>
				<stop offset="1" stop-color="#ff1" transform="scale(2)">
					<animate
						attributeName="stop-color"
						values="#ff10;#f920;#ff10"
						dur="5s"
						repeatCount="indefinite"
						autoReverse="true"
					/>
				</stop>
			</radialGradient>
		</defs>
	</svg>
</div>

<style>
	.container {
		position: absolute;
		left: 0;
		top: 0;
	}
</style>
