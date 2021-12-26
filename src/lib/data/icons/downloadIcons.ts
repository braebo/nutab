import collections from '../collections/'


let svgList = []

for (const collection of collections) {
	svgList = [...svgList, { collection: collection.title, images: collection.bookmarks.map(b => b.image) }]
}



const download_icons = () => {
	console.log('todo');
}
