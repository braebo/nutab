<script lang="ts">
	import { fade } from 'svelte/transition'
</script>

<template lang="pug">

	.dots(in:fade='{{ duration: 1000 }}')
		.dot.a .
		.dot.b .
		.dot.c .

</template>

<style lang="sass">
	
	.dots
		display: flex
		justify-content: center
		gap: 0.25rem

		height: 2rem

	.dot
		backface-visibility: hidden
		animation: wave 1.5s ease-in-out alternate infinite
	.b
		animation-delay: -0.5s
	.c
		animation-delay: -1.25s

	@keyframes wave
		0%
			transform: translateY(2px)
		100%
			transform: translateY(-2px)

</style>
