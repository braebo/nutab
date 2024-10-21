<script lang="ts">
	import { cubicOut } from 'svelte/easing'
	import { fly } from 'svelte/transition'
</script>

<svg width="100%" height="100%" viewBox="0 0 51 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	<rect x="1.64884" y="1.67688" width="47.1442" height="20.6038" rx="10.3019" fill="var(--light-a)" />
	<circle
		transition:fly={{
			y: 5,
			delay: 0,
			duration: 250,
			easing: cubicOut
		}}
		cx="14.9305"
		cy="11.9788"
		r="3.558"
		fill="var(--dark-a)"
	/>
	<circle
		transition:fly={{
			y: 5,
			delay: 100,
			duration: 250,
			easing: cubicOut
		}}
		cx="25.221"
		cy="11.9788"
		r="3.558"
		fill="var(--dark-a)"
	/>
	<circle
		transition:fly={{
			y: 5,
			delay: 200,
			duration: 250,
			easing: cubicOut
		}}
		cx="35.5114"
		cy="11.9788"
		r="3.558"
		fill="var(--dark-a)"
	/>
</svg>
