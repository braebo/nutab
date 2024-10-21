<script lang="ts">
	import { onDestroy, tick } from 'svelte'
	import { tweened } from 'svelte/motion'
	import { fly, fade } from 'svelte/transition'

	import HNItemGhost from './HNItemGhost.svelte'

	const a = tweened(0, { duration: 500 })
	const b = tweened(0)
	const c = tweened(100)

	interface Props {
		count: number;
	}

	let { count }: Props = $props();

	let stageTimer: NodeJS.Timeout

	let t = 1
	const animate = async () => {
		await tick()
		requestAnimationFrame(() => {
			switch (t) {
				case 0:
					a.set(0, { duration: 0 })
					b.set(0, { duration: 0 })
					c.set(0.01, { duration: 0 })
					break
				case 1:
					a.set(-50)
					b.set(20)
					c.set(150)
					break
				case 2:
					a.set(0)
					b.set(100)
					c.set(150)
					break
				case 3:
					a.set(150)
					b.set(200)
					c.set(300)
					break
				default:
					break
			}
			if (t < 3) t++
			else t = 0
			stageTimer = setTimeout(() => {
				animate()
				clearTimeout(stageTimer)
			}, 300)
		})
	}
	animate()

	onDestroy(() => (stageTimer = null))
</script>

<template lang="pug">

	.ghost-previews
		+each('Array(count).fill() as phantom, i')
			.item(in:fly='{{duration: 250 + (i * 50), delay: i * 50, y: 10 + i}}')
					HNItemGhost('--background-image'!='linear-gradient(to right, var(--light-b) {$a}%, var(--light-a) {$b}%, var(--light-b) {$c}%)')

</template>

<style lang="sass">
	.ghost-previews
		flex-direction: column
		align-items: center
		justify-content: center

		height: 100%
		max-height: 100%
		// padding-top: 5rem
		// padding-bottom: 10rem
		min-width: 800px
		
		opacity: 0.75
		transition: opacity 0.2s
		&:hover
			opacity: 1

	.item
		display: flex
		flex-direction: column

		width: 100%
</style>
