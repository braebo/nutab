import type { Folder, Bookmark } from '../types'

// import getIcon from '../besticon'  // TODO: Fetch icon from URL
import cuid from 'cuid'

// const defaultImage = // TODO: Generate a random svg or something

const default_theme = {
	background: '#1D1D1D',
	foreground: '#F5F5F5',
}

export const emptyFolder = (current_folder_count: number): Folder => ({
	folder_id: cuid(),
	user_id: '',
	icon: '📌',
	title: 'My Folder',
	bookmarks: [],
	position: current_folder_count + 1,
	active: true,
})

export const emptyBookmark = (current_folder: Folder): Bookmark => {
	const { title } = current_folder
	return {
		bookmark_id: cuid(),
		url: '',
		title: '',
		description: '',
		useImage: false,
		autoImage: false,
		image: null,
		tags: [title],
		...default_theme,
		position: current_folder.bookmarks.length + 1,
	}
}

export const defaultBookmarks: Bookmark[] = [
	{
		bookmark_id: cuid(),
		url: 'https://burakkarakan.com/devo/',
		title: 'Devo',
		description: 'Dev News Extensions',
		useImage: true,
		autoImage: false,
		image: 'https://github.com/karakanb/devo/raw/master/img/logo.png',
		tags: ['Dev', 'News'],
		...default_theme,
		position: 0,
	},
	{
		bookmark_id: cuid(),
		url: 'https://www.reddit.com/',
		title: 'Reddit',
		description: 'Front Page of the Internet',
		useImage: true,
		autoImage: false,
		image: 'https://www.redditinc.com/assets/images/site/reddit-logo.png',
		tags: ['Entertainment', 'News'],
		...default_theme,
		position: 2,
	},
	{
		bookmark_id: cuid(),
		url: 'https://www.youtube.com/',
		title: 'Youtube',
		description: '',
		useImage: true,
		autoImage: false,
		image: 'https://cdn.svgporn.com/logos/youtube-icon.svg',
		tags: ['Google', 'Video', 'Entertainment'],
		...default_theme,
		position: 3,
	},
	{
		bookmark_id: cuid(),
		url: 'https://github.com',
		title: 'Github',
		description: '',
		useImage: true,
		autoImage: false,
		// image: 'https://cdn.svgporn.com/logos/github-icon.svg',
		image: 'https://cdn.iconscout.com/icon/free/png-256/github-159-721954.png',
		tags: ['Dev', 'Github'],
		...default_theme,
		position: 4,
	},
	{
		bookmark_id: cuid(),
		url: 'https://mail.google.com/mail',
		title: 'Gmail',
		description: 'Email',
		useImage: true,
		autoImage: false,
		image: 'https://cdn.svgporn.com/logos/google-gmail.svg',
		tags: ['Google', 'Email'],
		...default_theme,
		position: 5,
	},
	{
		bookmark_id: cuid(),
		url: 'https://drive.google.com/drive/my-drive',
		title: 'Drive',
		description: 'Google Drive',
		useImage: true,
		autoImage: false,
		image: 'https://cdn.svgporn.com/logos/google-drive.svg',
		tags: ['Google', 'Storage'],
		...default_theme,
		position: 6,
	},
	{
		bookmark_id: cuid(),
		url: 'https://photos.google.com/',
		title: 'Photos',
		description: 'Google Photos',
		useImage: true,
		autoImage: false,
		image: 'https://cdn.svgporn.com/logos/google-photos.svg',
		tags: ['Google', 'Storage', 'Photos', 'Images'],
		...default_theme,
		position: 7,
	},
]

export const defaultFolder: Folder = {
	folder_id: cuid(),
	user_id: 'anon',
	icon: '🏠',
	title: 'General',
	bookmarks: defaultBookmarks.map((b) => b.bookmark_id),
	active: true,
	position: 0,
}
