export const randomRange = (min: number, max: number, clamp = false): number => {
	const isArray = Array.isArray(min)

	if (isArray) {
		const targetArray = min

		return targetArray[randomRange(0, targetArray.length - 1, true)]
	} else {
		const val = Math.random() * (max - min) + min

		return clamp ? Math.round(val) : val
	}
}
