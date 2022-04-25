<script lang="ts">
	import CommentIcon from './../graphics/CommentIcon.svelte'
	import type { IHNItem } from './types'

	// import { getMockMetaData } from './mockData'
	import { daysAgo } from '$lib/utils/daysAgo'
	import { fade } from 'svelte/transition'
	import { onMount } from 'svelte'
	import { randomBackground } from '$lib/data/settings/randomBackground'

	export let item: IHNItem
	export let i: number

	const time = new Date(item.time * 1000)
	const since = daysAgo(time).string

	const showComments = () => {
		alert('todo')
	}

	// let meta: IJsonLinkMeta = {
	// 	title: '',
	// 	description: '',
	// 	images: [''],
	// 	url: '',
	// 	domain: '',
	// 	duration: 100
	// }

	// const getImage = async (): Promise<IJsonLinkMeta> => {
	// 	const url = 'https://jsonlink.io/api/extract?url=' + item.url
	// 	const res = await fetch(url)
	// 	if (!res.ok) return
	// 	const json: IJsonLinkMeta = await res.json()
	// 	meta = json
	// 	console.log(JSON.stringify(json))
	// }

	// onMount(async () => {
	// 	// getImage()
	// 	// const json: IJsonLinkMeta = await getMockMetaData(i)
	// 	meta = await getMockMetaData(i)
	// })
</script>

<template lang="pug">

	article
		.image-container
			+if('item.meta.image')
				.image(style='background-image: url({item.meta.image})' in:fade)
				+else
					.image(style='{randomBackground()}')

		.col
			.row.header
				.col
					a.article(href='{item.url ? item.url : ``}' target='_blank')
						h2 {item.title}

					.row.info
						.since {since}
						span.dot · 
						a.author(target='_blank' href!='{`https://news.ycombinator.com/user?id=${item.by}`}') {item.by}
					//- a.domain(href='{item.meta.domain || ``}')
					//- 	| {item.meta.domain || ''}
	
				//- .points {item.score} points
				//- p.since {since}
			.row
				p.description {item.meta.description || ''}
	

		.comments
			.comment-count(on:click='{showComments}')
				| {item.kids ? item.kids.length : 0}
			.comment-icon
				CommentIcon

				//- p.since {since} 
				//- 	span.dot · 
				//- 	a.author(target='_blank' href='https://news.ycombinator.com/user?id="{item.by}"') {item.by}

		//- span.i {i}

</template>

<style lang="sass">
	article
		box-sizing: border-box
		position: relative
		display: flex
		align-items: space-between
		gap: 1.5rem

		width: 800px
		max-width: min(1000px, 90vw)
		min-height: 112px
		padding: 0.75rem
		margin-bottom: 1.5rem

		background: var(--light-a)
		border-radius: var(--radius)
		border: 1px solid transparent
		box-shadow: 0px 0.9px 0.7px rgba(0, 0, 0, 0.008), 0px 2.1px 1.8px rgba(0, 0, 0, 0.012), 0px 3.9px 3.4px rgba(0, 0, 0, 0.015), 0px 6.9px 6px rgba(0, 0, 0, 0.018), 0px 13px 11.3px rgba(0, 0, 0, 0.022), 0px 31px 27px rgba(0, 0, 0, 0.03)		

		transition: transform 0.2s, box-shadow 0.2s
		&:hover
			// border-color: rgb(var(--dark-d-rgb), 0.5)
			transform: scale(1.025)
			box-shadow: 0px 1.8px 0.7px rgba(0, 0, 0, 0.006), 0px 4.3px 1.8px rgba(0, 0, 0, 0.008), 0px 8.1px 3.4px rgba(0, 0, 0, 0.01), 0px 14.5px 6px rgba(0, 0, 0, 0.012), 0px 27.2px 11.3px rgba(0, 0, 0, 0.014), 0px 65px 27px rgba(0, 0, 0, 0.02)

			& .image
				filter: grayscale(0%)

		cursor: pointer
		backface-visibility: hidden


	.header
		// padding-bottom: 0.25rem
		margin-bottom: 0.5rem
		padding-right: 1rem

	h2
		line-height: 1.5rem
		color: var(--dark-a)

		font-size: 1rem
		width: max-content
		max-width: min(90%, 60vw)
		font-variation-settings: 'wght' 500
		font-family: var(--font-a)
		word-spacing: 0px
		letter-spacing: 0.5px

		transition: 0.25s
		&:hover
			font-variation-settings: 'wght' 700
			letter-spacing: 0.25px
			// font-weight: 700


	a
		text-decoration: none
		&:hover
			text-decoration: underline
		&.article
			text-decoration: none

	.info
		margin: 0

		color: var(--dark-d)

		font-size: 0.8em
		font-weight: 300

	.col
		display: flex
		flex-direction: column
		flex-grow: 1
		
		width: 100%
		height: 100%

	.row
		display: flex
		width: 100%

	.article
		text-decoration: none

	// .domain
	// 	color: var(--light-d)
	// 	font-weight: 300
	// 	font-size: 0.8rem
	// 	&:hover
	// 		text-decoration: underline
	
	.description
		width: 550px
		max-width: 90%
		// margin-bottom: 0.5rem
		// max-height: 1.5rem
		height: 1.2rem

		color: var(--dark-d)

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


	.image
		min-width: 125px
		min-height: 100px

		background-size: cover
		background-position: center
		background-repeat: no-repeat
		border-radius: var(--radius-sm)

		transition: filter 0.3s
		filter: grayscale(100%)

	.author, .since
		flex-wrap: nowrap
		word-wrap: none
		white-space: nowrap
		color: var(--light-d)
		word-spacing: -1px
		width: max-content
	
	.dot
		margin: 0 0.25rem
	
	// .since
	// 	margin: 0 0.25rem 0 auto



	// .i
	// 	position: absolute
	// 	left: 0.5rem
	// 	top: 1rem

	// 	width: 0.75em

	// 	color: var(--light-d)

	// 	font-size: 1rem
	// 	font-weight: 200
	// 	text-align: right
	// 	line-height: 1


	// .points
	// 	color: var(--light-d)

	// 	font-size: 0.8em
	// 	font-weight: 300
	
	

</style>
