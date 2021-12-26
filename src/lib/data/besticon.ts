// import defaultCollection from './collections/defaults'

// https://besticon-demo.herokuapp.com/
const iconFromUrl = (url: string) => `https://besticon-demo.herokuapp.com/allicons.json?url=${encodeURIComponent(url)}`

const getIcon = async (url: string) => {
	try {
		fetch(iconFromUrl(url))
			.then((response => response.json()))
			.then(data => {
				console.log(data)
				return data
			})
	} catch (e) { console.error(e) }
}

export default getIcon
