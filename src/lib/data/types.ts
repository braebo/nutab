export type Bookmark = {
	bookmark_id: string
	url: string
	title?: string
	description?: string
	image?: string | null
	background?: string | null
	foreground?: string | null
	tags: string[]
}

export type Folder = {
	folder_id: string
	user_id: string
	title: string
	bookmarks: Bookmark[]
	position: number
	active: boolean
}

export interface Engine {
	/**
	 * Standard index of the array item.
	 */
	position: number

	/**
	 * The display name of the search Engine.
	 */
	name?: string

	/**
	 * The query url.
	 * @example 'https://www.google.com/search?q='
	 */
	url: string

	/**
	 * SVG in a Svelte Component
	 */
	icon: any

	/**
	 * Alias to set search engine.
	 * @example Typing 'g ' will activate google'
	 */
	alias: string
}
