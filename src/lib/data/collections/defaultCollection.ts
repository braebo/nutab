import type { Collection } from '../types'
import getIcon from '../besticon'
import cuid from 'cuid'

// const defaultImage = // TODO: "Generate a random svg or something"

const default_theme = {
	background: '#1D1D1D',
	foreground: '#F5F5F5',
}

const defaultCollection: Collection = {
    collection_id: cuid(),
    user_id: 'anon',
    title: '🏠',
    image: null,
    bookmarks: [
        {
            bookmark_id: cuid(),
            url: 'https://burakkarakan.com/devo/',
            title: 'Devo',
            description: 'Dev News Extensions',
            image: 'https://github.com/karakanb/devo/raw/master/img/logo.png',
            collection_id: 'default',
            tags: ['Dev', 'News'],
			...default_theme
        },
        {
            bookmark_id: cuid(),
            url: 'https://openbase.io/',
            title: 'OpenBase',
            description: 'Repo Search Engine',
            image: 'https://d25hn4jiqx5f7l.cloudfront.net/companies/logos/medium/openbase_1601666331.png',
            collection_id: 'default',
            tags: ['Dev', 'Code', 'Search'],
			...default_theme
        },
        {
            bookmark_id: cuid(),
            url: 'https://www.reddit.com/',
            title: 'Reddit',
            description: 'Front Page of the Internet',
            image: 'https://www.redditinc.com/assets/images/site/reddit-logo.png',
            collection_id: 'default',
            tags: ['Entertainment', 'News', 'Media'],
			...default_theme
        },
        {
            bookmark_id: cuid(),
            url: 'https://www.youtube.com/',
            title: 'Youtube',
            description: '',
            image: 'https://cdn.svgporn.com/logos/youtube-icon.svg',
            collection_id: 'default',
            tags: ['Google', 'Video', 'Entertainment', 'Media'],
			...default_theme
        },
		{
			bookmark_id: cuid(),
			url: 'https://github.com',
			title: 'Github',
			description: '',
			image: 'https://cdn.svgporn.com/logos/github-icon.svg',
			collection_id: 'default',
			tags: ['Dev', 'Github'],
			...default_theme
		},
        {
            bookmark_id: cuid(),
            url: 'https://mail.google.com/mail',
            title: 'Gmail',
            description: 'Email',
            image: 'https://cdn.svgporn.com/logos/google-gmail.svg',
            collection_id: 'default',
            tags: ['Google', 'Email', 'Mail'],
			...default_theme
        },
        {
            bookmark_id: cuid(),
            url: 'https://drive.google.com/drive/my-drive',
            title: 'Drive',
            description: 'Google Drive',
			image: 'https://cdn.svgporn.com/logos/google-drive.svg',
            collection_id: 'default',
            tags: ['Google', 'Storage'],
			...default_theme
        },
        {
            bookmark_id: cuid(),
            url: 'https://photos.google.com/',
            title: 'Photos',
            description: 'Gogle Photos',
			image: 'https://cdn.svgporn.com/logos/google-photos.svg',
            collection_id: 'default',
            tags: ['Google', 'Storage', 'Photos', 'Images'],
			...default_theme
        },
    ],
    position: 0,
}

export default defaultCollection