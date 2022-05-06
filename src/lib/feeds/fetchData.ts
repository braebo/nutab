import type { IHNItem, ICategory, IMeta } from './types'

import { get } from 'svelte/store'

import { BATCH_SIZE, CORS, DEFAULT_CATEGORY, INITIAL_SIZE } from './constants'
import { currentCategory, list } from './stores'
import { daysAgo } from '$lib/utils/daysAgo'

import fetchMeta from './fetchMeta'

export const fetchCategory = async (type: ICategory = DEFAULT_CATEGORY): Promise<number[]> => {
	const res: Response | void = await fetch(`${CORS}https://hacker-news.firebaseio.com/v0/${type}.json`, {
		headers: {
			Accept: 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	}).catch((e) => console.error('Hmm.. problem fetching the stories.', e))
	if (!res) return []
	const category = await res.json()
	return category as number[]
}

export const fetchItem = async (id: IHNItem['id']) => {
	const item = await fetch(`${CORS}https://hacker-news.firebaseio.com/v0/item/${id}.json`)
		.then((res) => res.json())
		.catch((e) => console.error(`Hmm.. problem fetching story ${id}: `, e))
	return item
}

let first = true

export const fetchStories = async (rangeLower = 0, type = DEFAULT_CATEGORY): Promise<IHNItem[]> => {
	const currentList = get(list)
	const rangeUpper = first ? INITIAL_SIZE : rangeLower + BATCH_SIZE
	// console.log('rangeLower', rangeLower)
	// console.log('rangeUpper', rangeUpper)

	if (first) first = false

	// initialize the list or change it's category
	if (get(currentCategory) != type || currentList.length < rangeUpper) {
		list.set(await fetchCategory(type))
	}
	// get id's of the new stories
	const ids = get(list).slice(rangeLower, rangeUpper)
	// console.log('ids', ids)

	// fetch stories
	let stories: IHNItem[] = []
	let storyPromises = []
	for (let id of ids) {
		storyPromises.push(fetchItem(id))
	}
	stories = await Promise.all(storyPromises)

	// fetch opengraph metadata
	let metas: IMeta[] = []
	let metaPromises = []
	for (let story of stories) {
		metaPromises.push(fetchMeta(`${CORS}${story.url}`))
	}
	metas = await Promise.all(metaPromises)
	stories.forEach((story, i) => {
		story.meta = metas[i]
		story.days_ago = daysAgo(new Date(story.time * 1000)).string
	})

	// console.log({ metas })
	// console.log({ stories })

	return stories
}
