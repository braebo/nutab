const randomHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')

export const randomColor = (n = 6) => `#${randomHex(n)}`

export const randomGradient = () => `background-image: linear-gradient(to bottom, ${randomColor()}, ${randomColor()});`

export const randomBackground = () => {
	const a = randomColor()
	const b = randomColor()
	const opacity = 48
	const gradient = `linear-gradient(to bottom, ${a}, ${b})`

	return { a, b, opacity, gradient }
}
