<script lang="ts">
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor'
	import Tooltip from '$lib/ui/Tooltip.svelte'
	import { slide } from 'svelte/transition'
	import Modal from '$lib/ui/Modal.svelte'

	let img = $bookmarkEditor?.image || ''

	export let open = false
	export let urlActive = false

	const handleChange = (e: InputEvent) => {
		$bookmarkEditor.image = (e.target as HTMLInputElement).value
	}
</script>

<template lang="pug">

	Tooltip(content='Change_image_URL' offset=[-60, 100])
		.image-url-btn(on:click!='{() => open = !open}' class:open)
			+if('urlActive')
				.link-icon 🔗

	+if('open')
		.modal
			input(
				type='text'
				bind:value='{img}'
				on:blur!='{() => open = false}'
				on:input='{handleChange}'
				placeholder='Image_from_URL'
				transition:slide
			)

</template>

<style lang="sass">

	.image-url-btn
		position: absolute
		display: flex
		justify-content: center
		align-items: center
		top: 0

		width: 100%
		height: 80%
		margin: auto

		opacity: 0
		backdrop-filter: blur(0px) grayscale(0%)
		transform: translateY(25%)

		vertical-align: center
		text-align:	center
		transition: 0.2s

		cursor: pointer
		
		&:hover, &.open
			font-size: 1.5rem
			opacity: 1
			backdrop-filter: blur(1px) grayscale(75%)

	
	.modal
		position: fixed
		inset: 0
		left: 0
		right: 0
		margin: 0 auto
		top: 0.5rem
		z-index: 999
		width: 75%

	input
		padding: 0.25rem
		width: 400px
		font-size: 10px
		
		background: var(--light-a)
		color: var(--dark-d)
		border-radius: var(--radius-sm)
		border: 1px solid var(--light-b)
		outline: none

		&:focus
			&::placeholder
				opacity: 0

</style>
