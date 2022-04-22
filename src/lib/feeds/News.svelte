<script>
	import HN from '$lib/feeds/HN.svelte'
</script>

<template lang="pug">
	
	.news
		HN

</template>

<style lang="sass">
	.news
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		top: -100%
		height: 100vh
		width: 800px
		margin: auto
</style>
