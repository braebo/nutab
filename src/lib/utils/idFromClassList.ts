export const idFromClassList = (classes: DOMTokenList, prefix: string): number | null => {
	let i: number | null = null
	classes.forEach((c) => {
		if (i === null && c.includes(prefix) && c.length > 3) {
			i = parseInt(c.split(prefix)[1])
		}
	})
	return i || i === 0 ? i : null
}
