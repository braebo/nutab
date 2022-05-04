<script>
	import HN from '$lib/feeds/HN.svelte'
</script>

<template lang="pug">
	
	.news
		HN

</template>

<style lang="sass">
	.news
		// display: flex
		// flex-direction: column
		// align-items: center
		// justify-content: center
		top: -100%
		
		height: 100vh
		width: 100vw
		// max-width: min(800px, 100vw)
		// padding: 1rem
		// margin: auto
</style>
