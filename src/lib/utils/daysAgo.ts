/**
 * Calculates the number of days between.
 * @param time
 * @returns
 * 	int: number of days
 * 	string: sentence describing the number of days (e.g. "today", "yesterday" or "3 days ago")
 */
export const daysAgo = (time: Date) => {
	const oneDayMs = 86_400_000
	const today = new Date()
	const int = Math.round(Math.abs((+today - +time) / oneDayMs))
	const string = int === 0 ? 'today' : int === 1 ? 'yesterday' : `${int} days ago`
	const result = {
		int,
		string
	}
	Object.defineProperty(result, Symbol.toPrimitive, {
		value: () => int
	})
	return result
}
