<script lang="ts">
	interface Props {
		size?: number;
	}

	let { size = 100 }: Props = $props();
</script>

<div class="container" style="width: {size}px;">
	<svg id="moon" width="100%" height="100%" viewBox="-5 -5 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle x="5" y="5" r="2.5" fill="url(#MoonGradient)" />
		<defs>
			<radialGradient id="MoonGradient" cx="50%" cy="50%" r="75%" fx="20%" fy="50%">
				<stop offset="0.5" stop-color="#888" />
				<stop offset="1" stop-color="#FFF" />
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
