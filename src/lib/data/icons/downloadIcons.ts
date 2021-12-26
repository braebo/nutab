import folders from '../folders'

let svgList = []

for (const folder of folders) {
	svgList = [...svgList, { folder: folder.title, images: folder.bookmarks.map((b) => b.image) }]
}

const download_icons = () => {
	console.log('todo')
}
