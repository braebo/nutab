<script lang="ts">
	import { fetchMeta } from '$lib/feeds/fetchMeta'
	import type { IHNItem, IMeta } from './types'

	import { formatDistanceToNow } from 'date-fns'
	import { fly } from 'svelte/transition'
	import HNItem from './HNItem.svelte'
	import { dev } from '$app/env'
	import { daysAgo } from '$lib/utils/daysAgo'
	import HnThread from './HNThread.svelte'

	let items: IHNItem[] = []

	let list: IHNItem['type'] = 'story'
	let defaultCategory: 'topstories' | 'newstories' | 'beststories' = 'topstories'

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
		const story = await fetch(`${cors}https://hacker-news.firebaseio.com/v0/item/${id}.json`)
			.then((res) => res.json())
			.catch((e) => console.error(`Hmm.. problem fetching story ${id}: `, e))
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
			const url = dev ? `${cors}${story.url}` : story.url
			metaPromises.push(fetchMeta(url))
		}
		metas = await Promise.all(metaPromises)
		stories.forEach((story, i) => {
			story.meta = metas[i]
			story.days_ago = daysAgo(new Date(story.time * 1000)).string
		})

		console.log({ metas })
		console.log({ stories })

		return stories
	}

	let activeThread: number | null = null

	let showThread = (e: CustomEvent) => {
		activeThread = null
		activeThread = e.detail.id
	}
</script>

<template lang="pug">

	.hn-container
		.story-previews
			+await('getStories()')
				| ...
				+then('stories')
					+each('stories as item, i')
						.item(in:fly='{{duration: 250 + (i * 50), delay: i * 50, y: 10 + i}}')
							HNItem({item} on:showThread='{showThread}')

					| {start}

				+if('next')
					button(on:click='{nextPage}') Next

				+catch('e') {e}

		+if('activeThread')
			HnThread(threadId='{activeThread}')

</template>

<style lang="sass">
	.hn-container
		display: flex
		align-items: center
		justify-content: center
		height: 100vh
		width: 100vw
		gap: 4rem
	.item
		display: flex
		flex-direction: column
</style>
