<script lang="ts">
	import HNItem from './HNItem.svelte'
	import { dev } from '$app/env'

	import type { IHNItem } from './types'

	let items: IHNItem[] = []

	let list: IHNItem['type'] = 'story'
	type Category = 'topstories' | 'newstories' | 'beststories'
	let defaultCategory: Category = 'beststories'

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

		let stories: IHNItem[] = []
		let promises = []
		for (let id of ids) {
			promises.push(getItem(id))
		}

		stories = await Promise.all(promises)
		console.log({ stories })

		return stories
	}
</script>

<div class="hn-container">
	{#await getStories() then stories}
		{#each stories as item, index}
			<HNItem {item} {index} />
		{/each}
		<!-- <pre>{JSON.stringify(stories, null, 2)}</pre> -->
		<pre>{start}</pre>
		{#if next}
			<button on:click={nextPage}>Next</button>
		{/if}
	{:catch e}
		<pre>{e}</pre>
	{/await}
</div>
