<script lang="ts">
	import type { IMeta } from './fetchMeta'
	import type { IHNItem } from './types'

	import { fly } from 'svelte/transition'
	import HNItem from './HNItem.svelte'
	import { dev } from '$app/env'

	let items: IHNItem[] = []

	let list: IHNItem['type'] = 'story'
	type Category = 'topstories' | 'newstories' | 'beststories'
	let defaultCategory: Category = 'topstories'

	const PAGE_SIZE = 5
	const page = 1

	$: start = 1 + (page - 1) * PAGE_SIZE

	let next = false
	const nextPage = () => alert('todo')

	const cors = dev ? 'http://localhost:8080/' : ''

	const getCategory = async (type = defaultCategory): Promise<number[]> => {
		const res: Response | void = await fetch(`${cors}https://hacker-news.firebaseio.com/v0/${type}.json`, {
			headers: {
				Accept: 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		}).catch((e) => console.error('Hmm.. problem fetching the stories.', e))
		if (!res) return []
		const category = await res.json()
		console.log({ category })
		return category as number[]
	}

	const getItem = async (id: IHNItem['id']) => {
		const story = await fetch(`${cors}https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
			headers: {
				Accept: 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		})
			.then((res) => res.json())
			.catch((e) => console.error(`Hmm.. problem fetching story ${id}: `, e))
		console.log(story)
		return story
	}

	const getStories = async (type = defaultCategory): Promise<IHNItem[]> => {
		const res = await getCategory(type)
		const ids = res.slice(start, start + PAGE_SIZE)

		next = res.length > start + PAGE_SIZE

		// fetch stories
		let stories: IHNItem[] = []
		let storyPromises = []
		for (let id of ids) {
			storyPromises.push(getItem(id))
		}
		stories = await Promise.all(storyPromises)

		// fetch opengraph metadata
		let metas: IMeta[] = []
		let metaPromises = []
		for (let story of stories) {
			metaPromises.push(getMeta(story.url))
		}
		metas = await Promise.all(metaPromises)
		stories.forEach((story, i) => {
			story.meta = metas[i]
		})
		console.log({ metas })
		console.log({ stories })

		return stories
	}

	const getMeta = async (url: string): Promise<IMeta> => {
		const res = await fetch('https://jsonlink.io/api/extract?url=' + url)
		if (!res.ok) return {}

		const meta: IJsonLinkMeta = await res.json()

		return meta
	}
</script>

<template lang="pug">

	.hn-container
		+await('getStories()')
			| ...
			+then('stories')
				+each('stories as item, i')
					.item(in:fly='{{duration: 250 + (i * 50), delay: i * 50, y: 10 + i}}')
						HNItem({item} {i})

				| {start}

			+if('next')
				button(on:click='{nextPage}') Next
		
			+catch('e') {e}

</template>
