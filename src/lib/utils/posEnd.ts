// place the cursor at end */
export default function posEnd(node) {
	const length = node.value.length;

	// Mostly for Web Browsers
	if (node.setSelectionRange) {
		node.focus();
		node.setSelectionRange(length, length);
	} else if (node.createTextRange) {
		const t = node.createTextRange();
		t.collapse(true);
		t.moveEnd('character', length);
		t.moveStart('character', length);
		t.select();
	}
}