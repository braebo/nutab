import type { Settings } from '$lib/stores/settings.svelte'
import type { Component } from 'svelte'
export type { Settings }

export interface User {
	phrase: string[]
	email?: string
}

/**
 * All data store
 */
export type UserData = {
	email?: string
	data: {
		bookmarks: Bookmark[]
		folders: Folder[]
		settings?: Settings
	}
}

/**
 * A single bookmark.
 */
export type Bookmark = {
	/**
	 * The unique identifier for the bookmark used internally.
	 */
	bookmark_id: string
	/**
	 * The url of the bookmark.
	 */
	url: string
	/**
	 * The title of the bookmark, optionally displayed in the grid.
	 */
	title: string
	/**
	 * An optional description, displayed in the BookmarkEditor.
	 */
	description: string
	/**
	 * Whether or not to use an image URL for the bookmark.
	 */
	useImage: boolean
	/**
	 * Whether or not to attempt to automatically fetch the url's favicon.
	 */
	autoImage: boolean
	/**
	 * A custom image URL, if used.
	 */
	image: string | null
	/**
	 * The background color of the bookmark, if used.
	 */
	background: string | null
	/**
	 * The foreground color of the bookmark title when not using an image.
	 */
	foreground: string | null
	/**
	 * User-defined tags associated with the bookmark.
	 */
	tags: string[]
	/**
	 * The position of the bookmark in the grid.
	 */
	position: number
}

/**
 * A collection of bookmarks.
 */
export type Folder = {
	/**
	 * The unique identifier for the folder used internally.
	 */
	folder_id: string
	/**
	 * The unique identifier for the user.
	 */
	user_id: string
	/**
	 * The icon displayed in the sidebar.
	 */
	icon: string
	/**
	 * The title of the folder, displayed in the sidebar.
	 */
	title: string
	/**
	 * All bookmark ids contained in a folder.
	 */
	bookmark_ids: Bookmark['bookmark_id'][]
	/**
	 * The position of the folder in the sidebar.
	 */
	position: number
	/**
	 * Whether or not the folder is currently the active one displayed in the grid.
	 */
	active: boolean
}

/**
 * Used to populate the folder sidebar.
 */
export interface FolderListItem {
	folder_id: Folder['folder_id']
	title: Folder['title']
	icon: Folder['icon']
}

/**
 * A single search engine config.
 */
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
	icon: Component

	/**
	 * Alias to set search engine.
	 * @example Typing 'g ' will activate google'
	 */
	alias: string
}

/**
 * A theme config.
 */
export interface ThemeConfig {
	/**
	 * The main background gradient.
	 */
	background: string
	/**
	 * Whether or not to lock the background.
	 * @todo - This seems to be unused.
	 */
	lockBackground: boolean
	/**
	 * User-defined alternative to the randomly generated gradients.
	 */
	customGradient: boolean
	/**
	 * The first color of the gradient, a hex6 color string.
	 * @example `#000000`
	 */
	gradientA: string
	/**
	 * The second color of the gradient, a hex6 color string.
	 * @example `#ffffff`
	 */
	gradientB: string
	/**
	 * The overall opacity of the gradient layer.
	 */
	gradientOpacity: number
	/**
	 * The angle of the gradient.
	 * @todo - This would be nice to have.
	 */
	// angle: number
}

/**
 * A set of theme configs for light, dark, and shared theme mode.
 */
export type ThemeConfigs = {
	shared: ThemeConfig
	light: ThemeConfig
	dark: ThemeConfig
}
