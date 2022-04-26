export const fetchItem = async (id: number) => {
	const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).catch((e) =>
		console.error('Hmm.. problem fetching item: ', e)
	)
	console.log(res)
	// if (!res) return
	const item = await res.json()
	console.log(item)
	return item
}
