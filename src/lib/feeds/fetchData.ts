import type { IHNItem, ICategory } from './types'

import { get } from 'svelte/store'

import { BATCH_SIZE, DEFAULT_CATEGORY, INITIAL_SIZE } from './constants'
import { currentCategory, items, list } from './stores'
import { daysAgo } from '$lib/utils/daysAgo'

import fetchMeta from './fetchMeta'

export const fetchCategory = async (type: ICategory = DEFAULT_CATEGORY): Promise<number[]> => {
	const res: Response | void = await fetch(`https://hacker-news.firebaseio.com/v0/${type}.json`, {
		headers: {
			Accept: 'application/json',
			'Access-Control-Allow-Origin': '*',
		},
	}).catch((e) => console.error('Hmm.. problem fetching the stories.', e))

	if (!res) return []

	const category = await res.json()

	return category as number[]
}

export const fetchItem = async (id: IHNItem['id']): Promise<IHNItem> => {
	const item = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
		.then((res) => res.json())
		.catch((e) => console.error(`Hmm.. problem fetching story ${id}: `, e))
	return item
}

let first = true

export const fetchStories = async (rangeLower = 0, type = DEFAULT_CATEGORY): Promise<IHNItem[]> => {
	const currentList = get(list)
	const rangeUpper = first ? INITIAL_SIZE : rangeLower + BATCH_SIZE
	if (first) first = false

	// initialize the list or change it's category
	if (get(currentCategory) != type || currentList.length < rangeUpper) {
		list.set(await fetchCategory(type))
	}
	// get id's of the new stories
	const ids = get(list).slice(rangeLower, rangeUpper)

	// fetch stories
	let stories: IHNItem[] = []
	let storyPromises = []
	for (const id of ids) {
		storyPromises.push(fetchItem(id))
	}
	stories = await Promise.all(storyPromises)

	// fetch opengraph metadata
	for (const story of stories) {
		if (!story.url) return

		story.days_ago = daysAgo(new Date(story.time * 1000)).string

		story.meta = {
			url: story.url,
			title: story.title,
			description: story.text,
			icon: '',
			image: '',
		}

		lazyLoadMeta(story.id, `${story.url}`)
	}

	return stories
}

async function lazyLoadMeta(id: number, url: string) {
	const meta = await fetchMeta(url)

	items.update((items) => {
		const item = items.find((item) => item.id === id)

		if (!item) return items

		item.meta.image = meta.image
		item.meta.description = meta.description

		return items
	})
}
