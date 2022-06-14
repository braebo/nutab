export type Bookmark = {
	bookmark_id: string
	url: string
	title?: string
	description?: string
	image?: string | null
	autoImage: boolean
	background?: string | null
	foreground?: string | null
	tags: string[]
	position: number
}

export type Folder = {
	folder_id: string
	user_id: string
	icon: string
	title: string
	bookmarks: Bookmark['bookmark_id'][]
	position: number
	active: boolean
}

//? Used to populate the folder sidebar
export interface FolderListItem {
	folder_id: Folder['folder_id']
	title: Folder['title']
	icon: Folder['icon']
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
