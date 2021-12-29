/**
 * Copies the given text to the clipboard.
 * @param {string} text The text to copy.
 */
export const copy = (string: string) => {
	const input = document.createElement('input')
	document.body.appendChild(input)
	input.setAttribute('id', 'input')
	input.value = string
	input.select()
	document.execCommand('copy')
	document.body.removeChild(input)
}
