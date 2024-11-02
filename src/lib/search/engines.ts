import type { Engine } from '$lib/data/types'

import StackOverflow from './icons/StackOverflow.svelte'
import DuckDuckGo from './icons/DuckDuckGo.svelte'
import HackerNews from './icons/HackerNews.svelte'
import Archive from './icons/Archive.svelte'
import Google from './icons/Google.svelte'
import MDN from './icons/MDN.svelte'

export const defaultEngines: Engine[] = [
	{
		position: 0,
		name: 'DuckDuckGo',
		url: `https://duckduckgo.com/?q=`,
		icon: DuckDuckGo,
		alias: 'd ',
	},
	{
		position: 1,
		name: 'Google',
		url: `https://www.google.com/search?q=`,
		icon: Google,
		alias: 'g ',
	},
	{
		position: 2,
		name: 'Internet Archive',
		url: `https://archive.org/search.php?query=`,
		icon: Archive,
		alias: 'ar ',
	},
	{
		position: 3,
		name: 'MDN',
		url: `https://developer.mozilla.org/en-US/search?q=`,
		icon: MDN,
		alias: 'mdn ',
	},
	{
		position: 4,
		name: 'StackOverflow',
		url: `https://stackoverflow.com/search?q=`,
		icon: StackOverflow,
		alias: 'so ',
	},
	{
		position: 5,
		name: 'HackerNews',
		url: `https://hn.algolia.com/?query=`,
		icon: HackerNews,
		alias: 'hn ',
	},
]
