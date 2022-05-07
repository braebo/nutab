<script>
	import { tick } from 'svelte'

	import { cMenu } from './settingsStore'

	const toggleCMenu = async () => {
		if (!$cMenu.visible && !$cMenu.pending) {
			$cMenu.visible = true
			await tick()
			$cMenu.x = window.innerWidth - $cMenu.el.clientWidth - 40
			$cMenu.y = 20
		}
	}
</script>

<template lang="pug">

	#settings-button(on:click!='{toggleCMenu}' class:active='{$cMenu.visible}')
		.dot
		.dot
		.dot

</template>

<style lang="sass">
	#settings-button
		position: absolute
		top: 0
		right: 0
		display: flex
		flex-direction: column
		justify-content: center
		align-items: center
		gap: 4px

		height: 50px
		width: 40px

		font-size: 25px

		box-sizing: content-box
		cursor: pointer

		transition: 150ms

	.active
		top: 3px !important
		gap: 10px !important


	.dot
		display: flex
		flex-direction: row

		width: 4px
		height: 4px

		border-radius: 100%

		background: var(--dark-c)

		pointer-events: none

</style>
