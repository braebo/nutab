<script lang="ts">
	import { formatDistanceToNow } from 'date-fns'
	import { fly } from 'svelte/transition'

	import HNComment from './HNComment.svelte'
	import { fetchItem } from './fetchData'

	export let threadId: number

	let transitionDuration = 200
</script>

<template lang="pug">

	+await('fetchItem(threadId)')
		| ...

		+then('item')
			article.item(out:fly='{{ y: -10, duration: transitionDuration }}' in:fly='{{ y: -10, delay: transitionDuration }}')
				a(class='main-link' href='{item.url}' target="_blank")
					h1 {item.title}

				p.meta
					| {item.score} points
					span.dot ·
					a(href!="https://news.ycombinator.com/user?id={item.by}")
						| {item.by}
					span.dot ·
					| {formatDistanceToNow(item.time * 1000).replace('about', '')} ago

				+if('item.text')
					.content {@html item.text}

			.comments
				+if('item.kids?.length > 0')
					+each('item.kids as commentId')
						HNComment({commentId})
					+else
						p No comments yet...

		+catch('e') Problem loading thread:
			pre {JSON.stringify(e)}

</template>

<style lang="sass">
	article.item
		margin: 0 auto
		padding: 1rem 2rem

		border-radius: 1.5rem
		border-bottom: 0.5rem solid rgba(var(--light-d-rgb), 0.25)
		background: rgba(var(--light-d-rgb), 0.05)

	.item :global(*)
		font-size: 1rem

	h1
		font-weight: 500
		font-size: 1.75rem !important

	:global(html.dark) .item
		border-bottom: 0.5rem solid rgba(var(--light-d-rgb), 0.25)

	.main-link
		display: block
		text-decoration: none

	.meta
		margin: 0 2rem 1rem 2rem
		font-size: 0.85rem
		font-weight: 300

	.content
		padding: 1rem
		color: var(--dark-a)
		background: rgba(var(--light-a-rgb), 0.2)
		border-radius: var(--radius-sm)

	.dot
		color: var(--light-d)
</style>
