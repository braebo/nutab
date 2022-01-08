export const idFromClassList = (classes: DOMTokenList, prefix: string): number | null => {
	let i = null
	classes.forEach((c) => {
		if (c.includes(prefix) && c.length > 3) {
			i = parseInt(c.split(prefix)[1])
		}
	})
	console.log(i, prefix)
	if (i || i === 0) return i
	else {
		console.log('idFromClassList: No id found.')
		return null
	}
}
