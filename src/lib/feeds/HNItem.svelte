<script lang="ts">
	import type { IHNItem, IJsonLinkMeta } from './types'

	import { daysAgo } from '$lib/utils/daysAgo'
	import { onMount } from 'svelte'
	import { getMockMetaData } from './mockData'

	export let item: IHNItem
	export let index: number

	const time = new Date(item.time * 1000)
	const since = daysAgo(time).string

	let meta: IJsonLinkMeta = {
		title: '',
		description: '',
		images: [''],
		url: '',
		domain: '',
		duration: 100
	}

	const getImage = async (): Promise<IJsonLinkMeta> => {
		const url = 'https://jsonlink.io/api/extract?url=' + item.url
		const res = await fetch(url)
		if (!res.ok) return
		const json: IJsonLinkMeta = await res.json()
		meta = json
		console.log(JSON.stringify(json))
	}

	onMount(async () => {
		// getImage()
		// const json: IJsonLinkMeta = await getMockMetaData(index)
		meta = await getMockMetaData(index)
	})
</script>

<template lang="pug">

	article
		+if('meta.images[0]')
			.image(style='background-image: url({meta.images[0]})')
			+else .image
		.col
			h2
				a(href='{item.url ? item.url : `/item/${item.id}`}' target='_blank')
					| {item.title}
					p.since {since}

			.points {item.score} points

			p
				a(target='_blank' href='https://news.ycombinator.com/user?id="{item.by}"') {item.by}

				a(href='/item/"{item.id}"')
					| {item.kids ? item.kids.length : 0}
					| {item.kids.length === 1 ? 'comment' : 'comments'}

			span.index {index}

</template>

<style>
	article {
		position: relative;
		display: flex;
		gap: 1.5rem;

		width: 700px;
		max-width: 90vw;
		padding: 1rem;
		margin-bottom: 1.5rem;

		background: var(--light-a);
		border-radius: var(--radius);
	}

	h2 {
		margin-bottom: 0.5rem;

		color: var(--dark-a);

		font-size: 1em;
		font-weight: 500;
	}

	h2 a {
		text-decoration: none;
	}

	p {
		margin: 0;

		color: var(--dark-d);

		font-size: 0.8em;
		font-weight: 300;
	}

	.since {
		word-spacing: 0;
	}

	.index {
		position: absolute;
		left: 0.5rem;
		top: 1rem;

		width: 0.75em;

		color: var(--light-d);

		font-size: 1rem;
		font-weight: 200;
		text-align: right;
		line-height: 1;
	}

	.points {
		color: var(--light-d);

		font-size: 0.8em;
		font-weight: 300;
	}

	.image {
		min-width: 100px;
		min-height: 75px;

		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: var(--radius-sm);
	}
</style>
