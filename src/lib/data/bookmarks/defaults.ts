import type { Folder, Bookmark } from '../types'
// import getIcon from '../besticon'  // TODO: Fetch icon from URL
import cuid from 'cuid'

// const defaultImage = // TODO: Generate a random svg or something

const default_theme = {
	background: '#1D1D1D',
	foreground: '#F5F5F5'
}

export const emptyBookmark = (current_folder_title: Folder['title']): Bookmark => ({
	bookmark_id: cuid(),
	url: '',
	title: '',
	description: '',
	image: null,
	tags: [current_folder_title],
	...default_theme
})

export const defaultBookmarks: Bookmark[] = [
	{
		bookmark_id: cuid(),
		url: 'https://burakkarakan.com/devo/',
		title: 'Devo',
		description: 'Dev News Extensions',
		image: 'https://github.com/karakanb/devo/raw/master/img/logo.png',
		tags: ['Dev', 'News'],
		...default_theme
	},
	{
		bookmark_id: cuid(),
		url: 'https://openbase.io/',
		title: 'OpenBase',
		description: 'Repo Search Engine',
		image: 'https://d25hn4jiqx5f7l.cloudfront.net/companies/logos/medium/openbase_1601666331.png',
		tags: ['Dev', 'Code', 'Search'],
		...default_theme
	},
	{
		bookmark_id: cuid(),
		url: 'https://www.reddit.com/',
		title: 'Reddit',
		description: 'Front Page of the Internet',
		image: 'https://www.redditinc.com/assets/images/site/reddit-logo.png',
		tags: ['Entertainment', 'News', 'Media'],
		...default_theme
	},
	{
		bookmark_id: cuid(),
		url: 'https://www.youtube.com/',
		title: 'Youtube',
		description: '',
		image: 'https://cdn.svgporn.com/logos/youtube-icon.svg',
		tags: ['Google', 'Video', 'Entertainment', 'Media'],
		...default_theme
	},
	{
		bookmark_id: cuid(),
		url: 'https://github.com',
		title: 'Github',
		description: '',
		image: 'https://cdn.svgporn.com/logos/github-icon.svg',
		tags: ['Dev', 'Github'],
		...default_theme
	},
	{
		bookmark_id: cuid(),
		url: 'https://mail.google.com/mail',
		title: 'Gmail',
		description: 'Email',
		image: 'https://cdn.svgporn.com/logos/google-gmail.svg',
		tags: ['Google', 'Email', 'Mail'],
		...default_theme
	},
	{
		bookmark_id: cuid(),
		url: 'https://drive.google.com/drive/my-drive',
		title: 'Drive',
		description: 'Google Drive',
		image: 'https://cdn.svgporn.com/logos/google-drive.svg',
		tags: ['Google', 'Storage'],
		...default_theme
	},
	{
		bookmark_id: cuid(),
		url: 'https://photos.google.com/',
		title: 'Photos',
		description: 'Gogle Photos',
		image: 'https://cdn.svgporn.com/logos/google-photos.svg',
		tags: ['Google', 'Storage', 'Photos', 'Images'],
		...default_theme
	}
]

export const defaultFolder: Folder = {
	folder_id: cuid(),
	user_id: 'anon',
	icon: '🏠',
	title: 'General',
	position: 0,
	bookmarks: defaultBookmarks,
	active: true
}
