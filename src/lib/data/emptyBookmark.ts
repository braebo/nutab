import type { Bookmark, Folder } from './types'
import cuid from 'cuid'

export const emptyBookmark = (
	current_folder_id: Folder['folder_id'],
	current_folder_title: Folder['title']
): Bookmark => ({
	bookmark_id: cuid(),
	url: 'url',
	title: 'title',
	description: 'description',
	image: null,
	background: 'rgb(0, 0, 0)',
	foreground: 'rgb(255, 255, 255)',
	tags: [current_folder_title],
	folder_id: current_folder_id
})
