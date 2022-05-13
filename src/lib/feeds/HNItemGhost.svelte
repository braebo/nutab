<script lang="ts">
	import CommentIcon from '$lib/graphics/icons/CommentIcon.svelte'
	import RandomWave from '$lib/graphics/RandomWave.svelte'

	import { randomBackground } from '$lib/data/settings/randomBackground'
	import { fade } from 'svelte/transition'
</script>

<template lang="pug">

	div.article
		.image-container
			.random-thumbnail
				.image(style='{randomBackground()}')
				.random-wave
					RandomWave

		.content.col
			.row.header
				.col
					.article-link
						h2 &nbsp;

					.row.info &nbsp;

			.row
				p.description &nbsp;

		.comments
			.comment-count
				| ∞
			.comment-icon
				CommentIcon

</template>

<style lang="sass">
	.article
		display: flex
		position: relative
		box-sizing: border-box
		align-items: space-between
		gap: 1.5rem

		max-width: min(800px, 90vw)
		min-height: 112px
		padding: 0.75rem
		margin: 0.75rem 10%

		background: var(--light-a)
		border-radius: var(--radius)
		border: 1px solid transparent
		box-shadow: 0px 0.9px 0.7px rgba(0, 0, 0, 0.008), 0px 2.1px 1.8px rgba(0, 0, 0, 0.012), 0px 3.9px 3.4px rgba(0, 0, 0, 0.015), 0px 6.9px 6px rgba(0, 0, 0, 0.018), 0px 13px 11.3px rgba(0, 0, 0, 0.022), 0px 31px 27px rgba(0, 0, 0, 0.03)		

		transition: transform 0.2s, box-shadow 0.2s

		& .random-thumbnail, .image
			filter: grayscale(0%)

		cursor: pointer
		backface-visibility: hidden


	.header
		margin-bottom: 0.5rem
		padding-right: 1rem

	h2
		width: 100%
		max-width: min(100%, 60vw)

		color: var(--dark-a)
		background-image: var(--background-image)
		border-radius: var(--radius-sm)

		font-size: 1rem
		line-height: 1.5rem
		font-variation-settings: 'wght' 500
		font-family: var(--font-a)
		word-spacing: 0px
		letter-spacing: 0.5px

		transition: 0.25s

	.col
		display: flex
		flex-direction: column
		flex-grow: 1

		width: 100%
		height: 100%


	.row
		display: flex
		width: 100%

	.info
		// height: 100%
		position: relative
		margin: 3px 0 0 0

		color: var(--dark-d)
		border-radius: var(--radius-sm)
		background-image: var(--background-image)

		font-size: 0.8em
		font-weight: 300

		&:after
			position: absolute
			content: ''
			right: 0
			
			width: 70%
			height: 15px
			
			background-color: var(--light-a)

	.content
		width: 75%

	.article-link
		text-decoration: none

	.description
		width: 90%
		max-width: min(550px, 90%)
		height: 1.2rem

		color: var(--dark-d)
		background-image: var(--background-image)
		border-radius: var(--radius-sm)

		font-weight: 400
		font-family: var(--font-a)
		font-size: 0.9rem
		text-overflow: ellipsis
		white-space: nowrap
		overflow: hidden

		opacity: 0.9
		transition: opacity 0.2s
		&:hover
			opacity: 1


	.comments
		display: flex
		align-items: center
		gap: 0.25rem
		position: absolute
		right: 0.5rem
		bottom: 0.5rem

		color: var(--light-d)

		font-family: var(--font-mono)
		font-size: 0.8rem
		
		&:hover .comment-icon
			transform: scale(1.2)


	.comment-icon
		width: 22px
		height: 22px
		margin-right: 0.25rem
		transition: transform 0.2s ease-out


	.image-container
		min-width: 125px
		min-height: 100px
		max-width: 125px
		max-height: 100px

	.random-thumbnail
		min-width: 125px
		min-height: 100px
		position: relative
		transition: filter 0.3s
		filter: grayscale(100%)

	.image
		min-width: 125px
		min-height: 100px

		background-size: cover
		background-position: center
		background-repeat: no-repeat
		border-radius: var(--radius-sm)

		transition: filter 0.3s
		filter: grayscale(100%)

	
	.random-wave
		position: absolute
		inset: 0
		width: 100%
		height: 100%

</style>
