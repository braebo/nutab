/**
 * Selects the text in the given element.
 * @param el An element or id.
 */

export function selectText(el: Element | string): void {
	if (typeof window === 'undefined') return
	if (typeof el === 'string') {
		el = document.getElementById(el)
	}
	if (!el) {
		console.error('select: no element found')
		return
	}
	const selection = window.getSelection()
	const range = document.createRange()
	range.selectNodeContents(el)
	selection.removeAllRanges()
	selection.addRange(range)
}
