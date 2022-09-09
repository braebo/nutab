<script lang="ts">
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor'
	import Tooltip from '$lib/ui/Tooltip.svelte'
	import { slide } from 'svelte/transition'
	import Modal from '$lib/ui/Modal.svelte'

	let img = $bookmarkEditor?.image || ''

	export let open = false

	const handleChange = (e: InputEvent) => {
		$bookmarkEditor.image = (e.target as HTMLInputElement).value
	}
</script>

<template lang="pug">

	+if('open')
		input(
			type='text'
			bind:value='{img}'
			on:blur!='{() => open = false}'
			on:input='{handleChange}'
			placeholder='Paste a custom image url here'
			transition:slide
		)

</template>

<style lang="sass">

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
